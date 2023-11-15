import { z } from 'zod'

export const MODELS = ["gpt-4", "gpt-4-1106-preview", "gpt-4-32k", "gpt-3.5-turbo-1106"] as const
const SWITCH = ["on", "off"] as const

export const schema = z.object({
  model: z.enum(MODELS),
  name: z.string().min(3).max(256),
  description: z.string().max(512),
  instructions: z.string().max(32768),
  code_interpreter: z.enum(SWITCH).nullable(),
  retrieval: z.enum(SWITCH).nullable(),
  // TODO(antoinewg): enable function
  function: z.enum(SWITCH).nullable(),
})
