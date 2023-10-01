'use client'

import { useChat, type Message } from 'ai/react'

import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { toast } from 'react-hot-toast'
import useStoreUserEffect from '@/hooks/useStoreUserEffect'
import { Id } from '@/convex/_generated/dataModel'
import { EmptyScreen } from './empty-screen'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: Id<'chats'>
}

export function Chat({ id, initialMessages }: ChatProps) {
  useStoreUserEffect()
  const chat = useChat({
    initialMessages,
    id,
    body: {
      id,
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText)
      }
    }
  })

  return (
    <>
      <div className="pb-[200px] pt-4 md:pt-10">
        {chat.messages.length > 0 ? (
          <>
            <ChatList messages={chat.messages} />
            <ChatScrollAnchor trackVisibility={chat.isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={chat.setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={chat.isLoading}
        stop={chat.stop}
        append={chat.append}
        reload={chat.reload}
        messages={chat.messages}
        input={chat.input}
        setInput={chat.setInput}
      />
    </>
  )
}
