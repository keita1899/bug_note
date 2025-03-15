import Image from 'next/image'
import { Comment as CommentType } from '../types/Comment'
import { useAuth } from '@/hooks/useAuth'

type CommentProps = {
  comment: CommentType
  onDelete: (id: string) => void
}

export const Comment = ({ comment, onDelete }: CommentProps) => {
  const { currentUser } = useAuth()
  const isCurrentUser = currentUser?.id === comment.user?.id

  return (
    <div
      className={`mb-4 flex flex-col gap-2 ${
        isCurrentUser ? 'items-end' : 'items-start'
      }`}
    >
      <span className="text-xs text-gray-500">
        {comment.user?.nickname || 'User Name'}
      </span>

      <div className="flex items-center gap-2">
        {!isCurrentUser && (
          <Image
            src={comment.user?.image || '/images/default-avatar.png'}
            alt={comment.user?.nickname || 'User Avatar'}
            width={30}
            height={30}
            className="rounded-full"
          />
        )}

        <div
          className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
            isCurrentUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-800'
          }`}
        >
          {comment.content}
        </div>

        {isCurrentUser && (
          <Image
            src={comment.user?.image || '/images/default-avatar.png'}
            alt={comment.user?.nickname || 'User Avatar'}
            width={30}
            height={30}
            className="rounded-full"
          />
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
        {isCurrentUser && (
          <button
            className="text-xs text-red-500"
            onClick={() => onDelete(comment.id)}
          >
            削除
          </button>
        )}
      </div>
    </div>
  )
}
