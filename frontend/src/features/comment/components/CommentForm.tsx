import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { CommentFormData } from '../types/CommnetFormData'

const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'コメントは必須です')
    .max(1000, 'コメントは1000文字以内で入力してください'),
})

type CommentFormProps = {
  onSubmit: SubmitHandler<CommentFormData>
}

export const CommnetForm = ({ onSubmit }: CommentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const handleCommentSubmit: SubmitHandler<CommentFormData> = (data) => {
    onSubmit(data)
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(handleCommentSubmit)}
      className="mt-4 space-y-4"
    >
      <textarea
        {...register('content')}
        placeholder="コメントを入力"
        rows={4}
        className="textarea w-full bg-gray-200"
      />
      {errors.content && (
        <p className="text-red-500">{errors.content.message}</p>
      )}
      <div className="text-right">
        <button type="submit" className="btn btn-primary">
          コメントを送信
        </button>
      </div>
    </form>
  )
}
