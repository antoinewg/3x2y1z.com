'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import { IconGitHub, IconSeparator } from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserButton, useAuth } from '@clerk/nextjs'

export function Header() {
  const { userId } = useAuth()

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <Sidebar>
          <SidebarList />
          <SidebarFooter>
            <ThemeToggle />
            <ClearHistory />
          </SidebarFooter>
        </Sidebar>
        {userId && (
          <div className="flex items-center">
            <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <a
          target="_blank"
          href="https://github.com/antoinewg/3x2y1z.com"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="ml-2 hidden md:flex">GitHub</span>
        </a>
      </div>
    </header>
  )
}
