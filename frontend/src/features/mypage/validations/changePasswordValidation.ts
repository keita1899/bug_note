import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(8, { message: '現在のパスワードは8文字以上で入力してください' })
      .max(128, { message: '現在のパスワードは128文字以下で入力してください' })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: '現在のパスワードは半角英数字で入力してください',
      }),
    password: z
      .string()
      .min(8, { message: '新しいパスワードは8文字以上で入力してください' })
      .max(128, { message: '新しいパスワードは128文字以下で入力してください' })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: '新しいパスワードは半角英数字で入力してください',
      }),
    password_confirmation: z
      .string()
      .min(8, { message: '確認用のパスワードは8文字以上で入力してください' })
      .max(128, {
        message: '確認用のパスワードは128文字以下で入力してください',
      })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: '確認用のパスワードは半角英数字で入力してください',
      }),
  })
  .refine((data) => data.password !== data.current_password, {
    message: '現在のパスワードと新しいパスワードが同じです',
    path: ['password'],
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: '新しいパスワードが一致しません',
    path: ['password_confirmation'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
