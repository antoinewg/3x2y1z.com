import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { Assistant } from './assistants/types'

export const runtime = 'edge'

export default async function Home() {
  const id = nanoid()

  const response = await fetch("https://api.openai.com/v1/assistants", {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v1",
    },
  })
  const data = await response.json()

  return <Chat id={id} assistants={data.data as Assistant[]} />
}
