import { z } from 'zod'

const IMAGE_SIZE_LIMIT = 3 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const updateProfileSchema = z.object({
  image: z
    .custom<File>()
    .optional()
    .refine(
      (file) => {
        if (!file) return true
        return file.size <= IMAGE_SIZE_LIMIT
      },
      {
        message: 'ファイル サイズは 3MB 以内にしてください',
      },
    )
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: '画像は JPEG, JPG, PNG, WebP のみアップロードできます',
    }),
  name: z
    .string()
    .min(1, { message: '名前は必須です' })
    .max(255, { message: '名前は255文字以下で入力してください' }),
  nickname: z
    .string()
    .max(255, { message: 'ニックネームは255文字以下で入力してください' }),
  bio: z
    .string()
    .max(500, { message: '自己紹介は500文字以下で入力してください' }),
  githubUrl: z
    .string()
    .url({ message: '正しいURLを入力してください' })
    .optional()
    .or(z.literal('')),
  websiteUrl: z
    .string()
    .url({ message: '正しいURLを入力してください' })
    .optional()
    .or(z.literal('')),
})

export type ProfileFormValues = z.infer<typeof updateProfileSchema>
