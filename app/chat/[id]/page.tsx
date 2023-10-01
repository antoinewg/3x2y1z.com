import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { Chat } from '@/components/chat'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export const runtime = 'edge'
export const preferredRegion = 'home'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const { userId } = auth()

  if (!userId) {
    return {}
  }

  const chat = await convex.query(api.chats.get, {
    id: params.id as Id<'chats'>
  })

  return {
    title: chat?.title?.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = auth()

  if (!userId) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await convex.query(api.chats.get, {
    id: params.id as Id<'chats'>
  })

  if (!chat || !chat._id) {
    notFound()
  }

  return <Chat id={chat._id} initialMessages={chat.messages} />
}
