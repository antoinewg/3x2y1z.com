import { kv } from '@vercel/kv'
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { Calculator } from 'langchain/tools/calculator'

import { AIMessage, ChatMessage, HumanMessage } from 'langchain/schema'
import { BufferMemory, ChatMessageHistory } from 'langchain/memory'

import { nanoid } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'

export const runtime = 'edge'

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === 'user') {
    return new HumanMessage(message.content)
  } else if (message.role === 'assistant') {
    return new AIMessage(message.content)
  } else {
    return new ChatMessage(message.content, message.role)
  }
}

const PREFIX_TEMPLATE = `You are a helpful assistant named Robert. When asked a question, answer with a witty tone.`

/**
 * This handler initializes and calls an OpenAI Functions agent.
 * See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/agents/agent_types/openai_functions_agent
 */
export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()

  const messages = (body.messages ?? []).filter(
    (message: VercelChatMessage) =>
      message.role === 'user' || message.role === 'assistant'
  )
  const previousMessages = messages
    .slice(0, -1)
    .map(convertVercelMessageToLangChainMessage)
  const currentMessageContent = messages[messages.length - 1].content

  const tools = [new Calculator()]
  const chat = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0.7 })

  /**
   * The default prompt for the OpenAI functions agent has a placeholder
   * where chat messages get injected - that's why we set "memoryKey" to
   * "chat_history". This will be made clearer and more customizable in the future.
   */
  const executor = await initializeAgentExecutorWithOptions(tools, chat, {
    agentType: 'openai-functions',
    verbose: false,
    returnIntermediateSteps: false,
    memory: new BufferMemory({
      memoryKey: 'chat_history',
      chatHistory: new ChatMessageHistory(previousMessages),
      returnMessages: true,
      outputKey: 'output'
    }),
    agentArgs: {
      prefix: PREFIX_TEMPLATE
    }
  })

  const result = await executor.call({ input: currentMessageContent })

  const title = body.messages[0].content.substring(0, 100)
  const id = body.id ?? nanoid()
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload = {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [...messages, { content: result.output, role: 'assistant' }]
  }

  await kv.hmset(`chat:${id}`, payload)
  await kv.zadd(`user:chat:${userId}`, {
    score: createdAt,
    member: `chat:${id}`
  })

  /**
   * Agent executors don't support streaming responses (yet!), so stream back the
   * complete response one character at a time with a delay to simluate it.
   */
  const textEncoder = new TextEncoder()
  const fakeStream = new ReadableStream({
    async start(controller) {
      for (const character of result.output) {
        controller.enqueue(textEncoder.encode(character))
        await new Promise(resolve => setTimeout(resolve, 20))
      }
      controller.close()
    }
  })

  return new StreamingTextResponse(fakeStream)
}
