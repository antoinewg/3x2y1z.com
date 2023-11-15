import { z } from 'zod'

export const MODELS = ["gpt-3", "gpt-4"] as const
const SWITCH = ["on", "off"] as const

export const schema = z.object({
  model: z.enum(MODELS),
  name: z.string().min(3).max(256),
  description: z.string().max(512),
  instructions: z.string().max(32768),
  code_interpreter: z.enum(SWITCH).nullable(),
  retrieval: z.enum(SWITCH).nullable(),
  function: z.enum(SWITCH).nullable(),
})
