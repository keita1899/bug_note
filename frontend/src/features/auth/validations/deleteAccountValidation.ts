import { z } from 'zod'

export const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(1, { message: 'パスワードは必須です' })
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .max(128, { message: 'パスワードは128文字以下で入力してください' })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: 'パスワードは半角英数字で入力してください',
    }),
})

export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>
