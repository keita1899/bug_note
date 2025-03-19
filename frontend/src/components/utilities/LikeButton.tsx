import { FaHeart, FaRegHeart } from 'react-icons/fa'

type LikeButtonProps = {
  bugId: string
  likeCount: number
  isLiked: boolean
  isLoading?: boolean
  onToggleLike?: (bugId: string, isLiked: boolean) => void
}

const LikeButton = ({
  bugId,
  likeCount,
  isLiked,
  isLoading,
  onToggleLike,
}: LikeButtonProps) => {
  const handleToggleLike = () => {
    if (onToggleLike) {
      onToggleLike(bugId, isLiked)
    }
  }
  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className="z-10 flex items-center"
    >
      {isLiked ? (
        <FaHeart color="pink" size={24} />
      ) : (
        <FaRegHeart color="gray" size={24} />
      )}
      <div className="ml-1">{likeCount}</div>
    </button>
  )
}

export default LikeButton
