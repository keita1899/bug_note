import { z } from 'zod'

export const searchBugSchema = z.object({
  keyword: z
    .string()
    .max(100, 'キーワードは100文字以内で入力してください')
    .optional(),
})

export type SearchBugFormData = z.infer<typeof searchBugSchema>
