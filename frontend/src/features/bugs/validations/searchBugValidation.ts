import { z } from 'zod'

export const searchBugSchema = z.object({
  keyword: z
    .string()
    .max(100, 'キーワードは100文字以内で入力してください')
    .optional(),
  sort: z
    .enum(['newest', 'oldest', 'most_liked', 'least_liked'])
    .default('newest'),
})

export type SearchBugFormData = z.infer<typeof searchBugSchema>
