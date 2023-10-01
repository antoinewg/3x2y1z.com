'use client'

import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function HomeScreen() {
  const createChat = useMutation(api.chats.create)
  const router = useRouter()

  const handleStartWithMessage = useCallback(
    async (message: string) => {
      const title = message.substring(0, 100)
      const chat = await createChat({ title })
      router.push(`/chat/${chat?._id}`)
    },
    [createChat, router]
  )

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome to 3X2Y1Z!</h1>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here:
        </p>
        <Button
          variant="outline"
          className="mt-4 h-auto items-end text-base"
          onClick={() => handleStartWithMessage("")}
        >
          start conversation
        </Button>
      </div>
    </div>
  )
}
