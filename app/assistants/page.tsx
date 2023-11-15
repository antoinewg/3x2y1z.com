import { redirect } from 'next/navigation'

import { auth } from '@clerk/nextjs/server'
import AddAssistant from './add-assistant'

export const runtime = 'edge'
export const preferredRegion = 'home'

export default async function AssistantPage() {
  const { userId } = auth()

  if (!userId) {
    redirect(`/sign-in?next=/assistants`)
  }

  return (
    <div className="grid h-screen place-items-center">
      <AddAssistant />
    </div>
  )
}
