import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  const examples = useQuery(api.examples.get);

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
      </div>
    </div>
  )
}
