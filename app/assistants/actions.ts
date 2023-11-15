'use server'

import { ZodError } from 'zod'
import { revalidatePath } from 'next/cache'
import { schema } from './form'
import OpenAI from 'openai';
import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';

const openai = new OpenAI();

export async function createAssistant(prevState: any, formData: FormData) {
  try {
    const parsed = schema.parse({
      name: formData.get('name'),
      model: formData.get('model'),
      description: formData.get('description'),
      instructions: formData.get('instructions'),
      code_interpreter: formData.get('code_interpreter'),
      retrieval: formData.get('retrieval'),
      function: formData.get('function'),
    })

    const tools: AssistantCreateParams['tools'] = []
    if (parsed.retrieval === "on") {
      tools.push({ type: "retrieval" })
    }
    if (parsed.code_interpreter === "on") {
      tools.push({ type: "code_interpreter" })
    }

    const body: AssistantCreateParams = {
      model: parsed.model,
      name: parsed.name,
      description: parsed.description,
      instructions: parsed.instructions,
      tools,
      file_ids: [],
      metadata: {},
    }

    const result = await openai.beta.assistants.create(body)
    console.log("created assistant", result)
    return revalidatePath('/assistants')
  } catch (e) {
    if (e instanceof ZodError) {
      return { message: e.errors.map(err => `${err.path}: ${err.message}`).join("\n") }
    }
    return { message: 'Failed to create' }
  }
}
