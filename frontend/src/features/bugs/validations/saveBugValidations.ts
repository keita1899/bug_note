import { z } from 'zod'

export const bugSchema = z
  .object({
    title: z
      .string()
      .min(1, 'タイトルは必須です')
      .max(255, 'タイトルは255文字以内で入力してください'),
    error_message: z.string().optional(),
    content: z.string().min(1, 'エラー内容は必須です'),
    environments: z.array(
      z.object({
        category: z.string().optional(),
        name: z
          .string()
          .max(255, '環境の名前は255文字以内で入力してください')
          .optional(),
        version: z
          .string()
          .max(255, '環境のバージョンは255文字以内で入力してください')
          .optional(),
      }),
    ),
    expected_behavior: z.string().optional(),
    attempts: z.array(
      z.object({
        content: z.string().optional(),
      }),
    ),
    solution: z.string().optional(),
    cause: z.string().optional(),
    references: z.array(
      z.object({
        url: z
          .string()
          .max(255, '参考リンクは255文字以内で入力してください')
          .url('有効なURLを入力してください')
          .or(z.literal('')),
      }),
    ),
    etc: z.string().optional(),
    is_solved: z.boolean(),
    status: z.enum(['draft', 'published']).optional(),
  })
  .refine(
    (data) => {
      return (
        !data.is_solved || (data.solution && data.solution.trim().length > 0)
      )
    },
    {
      message: '解決済にするには解決方法を入力する必要があります',
      path: ['solution'],
    },
  )
  .refine(
    (data) => {
      return data.is_solved || data.status !== 'published'
    },
    {
      message: '未解決の場合公開できません',
      path: ['status'],
    },
  )

export type BugFormValues = z.infer<typeof bugSchema>
