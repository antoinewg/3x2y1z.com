import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import OpenAI from 'openai';

export const runtime = 'edge'

const openai = new OpenAI();

export default async function Home() {
  const id = nanoid()

  const data = await openai.beta.assistants.list()
  return <Chat id={id} assistants={data.data} />
}
