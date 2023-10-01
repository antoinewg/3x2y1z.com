import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { UserButton } from '@clerk/nextjs'

export const runtime = 'edge'

export default function Home() {
  const id = nanoid()

  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <Chat id={id} />
    </div>
  )
}
