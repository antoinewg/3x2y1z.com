import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'

export const runtime = 'edge'

export default function Home() {
  const id = nanoid()

  return <Chat id={id} />
}
