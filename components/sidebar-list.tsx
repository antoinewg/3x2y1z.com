'use client'

import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export function SidebarList() {
  const chats = useQuery(api.chats.list)

  return (
    <div className="flex-1 overflow-auto">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(chat => (
            <SidebarItem key={chat._id} chat={chat}>
              <SidebarActions chat={chat} />
            </SidebarItem>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
