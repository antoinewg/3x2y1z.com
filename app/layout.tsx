import { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

import { Toaster } from 'react-hot-toast'

import '@/app/globals.css'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import ConvexClientProvider from './ConvexClientProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.3x2y1z.com/'),
  title: {
    default: '3X2Y1Z',
    template: `%s - 3X2Y1Z`
  },
  description: 'An AI-powered chatbot.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'font-sans antialiased',
            fontSans.variable,
            fontMono.variable
          )}
        >
          <Toaster />
          <Providers attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex flex-1 flex-col bg-muted/50">
                <ConvexClientProvider>{children}</ConvexClientProvider>
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
