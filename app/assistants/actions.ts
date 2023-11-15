'use server'

import { ZodError } from 'zod'
import { revalidatePath } from 'next/cache'
import { schema } from './form'


export async function createAssistant(prevState: any, formData: FormData) {
  try {
    console.log("formData", formData)
    const parsed = schema.parse({
      name: formData.get('name'),
      model: formData.get('model'),
      description: formData.get('description'),
      instructions: formData.get('instructions'),
      code_interpreter: formData.get('code_interpreter'),
      retrieval: formData.get('retrieval'),
      function: formData.get('function'),
    })

    console.log(prevState, parsed)
    // const response = await fetch("https://api.openai.com/v1/assistants", { body: JSON.stringify({ name, model }) })
    return revalidatePath('/assistants')
  } catch (e) {
    if (e instanceof ZodError) {
      return { message: e.errors.map(err => `${err.path}: ${err.message}`).join("\n") }
    }
    return { message: 'Failed to create' }
  }
}
