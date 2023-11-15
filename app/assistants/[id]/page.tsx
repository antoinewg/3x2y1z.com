import { redirect } from 'next/navigation'

import { auth } from '@clerk/nextjs/server'

export const runtime = 'edge'
export const preferredRegion = 'home'

export default async function AssistantPage({ params }: { params: { id: string } }) {
  const { userId } = auth()

  if (!userId) {
    redirect(`/sign-in?next=/assistants/${params.id}`)
  }

  return (
    <div className="grid h-screen place-items-center">
      assistant {params.id}
    </div>
  )
}
