'use server'

import { ZodError } from 'zod'
import { revalidatePath } from 'next/cache'
import { schema } from './form'


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

    const tools: Array<{ type: string }> = []
    if (parsed.retrieval === "on") {
      tools.push({ type: "retrieval" })
    }
    if (parsed.code_interpreter === "on") {
      tools.push({ type: "code_interpreter" })
    }

    const body = {
      model: parsed.model,
      name: parsed.name,
      description: parsed.description,
      instructions: parsed.instructions,
      tools,
      file_ids: [],
      metadata: {},
    }

    const response = await fetch("https://api.openai.com/v1/assistants", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1",
      },
    })
    const result = await response.json();
    return revalidatePath('/assistants')
  } catch (e) {
    if (e instanceof ZodError) {
      return { message: e.errors.map(err => `${err.path}: ${err.message}`).join("\n") }
    }
    return { message: 'Failed to create' }
  }
}
