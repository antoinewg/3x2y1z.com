export type Assistant = {
  id: string
  object: "assistant"
  model: string
  name: string
  description: string | null
  instructions: string | null
  tools: Array<{ type: string }>
  file_ids: string[]
  metadata: Record<string, unknown>
}
