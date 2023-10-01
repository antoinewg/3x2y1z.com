import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  const json = await req.json()
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: json.messages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const chat = await convex.query(api.chats.get, { id: json.id })

      if (chat?._id) {
        await convex.mutation(api.chats.update, { id: chat._id, title })
        await convex.mutation(api.messages.create, {
          content: completion,
          role: 'assistant',
          chatId: chat._id,
          authorId: chat?.authorId as Id<'users'>
        })
      }
    }
  })

  return new StreamingTextResponse(stream)
}
