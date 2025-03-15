import { Comment as CommentType } from '../types/Comment'
import { Comment } from '../ui/Comment'

type CommentListProps = {
  comments: CommentType[]
  onDelete: (id: string) => void
}

export const CommentList = ({ comments, onDelete }: CommentListProps) => {
  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-center text-gray-500">コメントはありません</p>
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} onDelete={onDelete} />
        ))
      )}
    </div>
  )
}
