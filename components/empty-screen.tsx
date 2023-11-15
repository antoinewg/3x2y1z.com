import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { IconArrowRight, IconPlus } from '@/components/ui/icons'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { Assistant } from '@/app/assistants/types'

export function EmptyScreen({ setInput, assistants }: Pick<UseChatHelpers, 'setInput'> & {
  assistants?: Assistant[]
}) {
  const examples = useQuery(api.examples.get)

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome to 3X2Y1Z!</h1>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {examples?.map(({ _id, message, heading }) => (
            <Button
              key={_id}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {heading}
            </Button>
          ))}
        </div>

        <h1 className="mb-2 mt-8 text-lg font-semibold">Assistants</h1>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {assistants?.map(({ id, name, model }) => (
            <Link
              key={id}
              className="flex h-auto items-center p-0 text-base"
              href={`/assistants/${id}`}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {name} ({model})
            </Link>
          ))}
          <Link className="flex h-auto items-center p-0 text-base" href="/assistants">
            <IconPlus className="mr-2 text-muted-foreground" />
            Add assistant
          </Link>
        </div>
      </div>
    </div>
  )
}
