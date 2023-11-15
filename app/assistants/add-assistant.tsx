"use client"

// @ts-expect-error
import { experimental_useFormState as useFormState, experimental_useFormStatus as useFormStatus } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createAssistant } from './actions'
import { Textarea } from '@/components/ui/textarea'
import { MODELS } from './form'
import { Switch } from '@/components/ui/switch'

const initialState = {
  message: null,
}

export default function AddAssistant() {
  const [state, formAction] = useFormState(createAssistant, initialState)
  const { pending } = useFormStatus()

  return (
    <form action={formAction}>
      <div className="mx-auto	 grid w-96 max-w-2xl px-4">
        <div className="grid	 w-96 gap-y-4 rounded-lg border bg-background p-8">
          <h1 className="mb-2 text-lg font-semibold">New assistant</h1>

          <Select name="model" required defaultValue={MODELS.at(0)}>
            <SelectTrigger>
              <SelectValue placeholder="choose a model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map(model => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input name="name" placeholder='name' defaultValue="Math tutor" />
          <Textarea name="description" placeholder='description' defaultValue="Math tutor" />
          <Textarea
            name="instructions"
            placeholder='instructions'
            defaultValue="You are a personal math tutor. When asked a question, write and run Python code to answer the question."
          />

          <h1 className="text-md mt-2 font-semibold">Tools</h1>

          <div className='flex items-center justify-between'>
            <label className="text-sm" htmlFor="code_interpreter">Code interpreter</label>
            <Switch name="code_interpreter" />
          </div>

          <div className='flex items-center justify-between'>
            <label className="text-sm" htmlFor="retrieval">Retrieval</label>
            <Switch name="retrieval" defaultValue="on" />
          </div>

          {/* TODO(antoinewg): enable functions */}
          {/* <div className='flex items-center justify-between'>
            <label className="text-sm" htmlFor="function">Function</label>
            <Switch name="function" />
          </div> */}

          {/* TODO(antoinewg): upload files */}

          <Button className="mt-8" type="submit" disabled={pending}>create</Button>
          {state?.message && <p className="text-red-500">{state.message}</p>}
        </div>
      </div>
    </form >
  )
}
