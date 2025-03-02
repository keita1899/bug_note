import { z } from 'zod'

export const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスは必須です' })
    .email({ message: '正しいメールアドレスを入力してください' })
    .max(255, { message: 'メールアドレスは255文字以下で入力してください' }),
  password: z
    .string()
    .min(1, { message: 'パスワードは必須です' })
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .max(128, { message: 'パスワードは128文字以下で入力してください' })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: 'パスワードは半角英数字で入力してください',
    }),
})

export type FormValues = z.infer<typeof schema>
