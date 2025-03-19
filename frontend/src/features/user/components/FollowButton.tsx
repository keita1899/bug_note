type FollowButtonProps = {
  isFollowing: boolean
  isLoading: boolean
  onFollow: () => void
  onUnfollow: () => void
}

export const FollowButton = ({
  isFollowing,
  isLoading,
  onFollow,
  onUnfollow,
}: FollowButtonProps) => {
  return (
    <button
      className={`btn ${isFollowing ? 'btn-error' : 'btn-primary'}`}
      disabled={isLoading}
      onClick={isFollowing ? onUnfollow : onFollow}
    >
      {isLoading ? (
        <span
          className="loading loading-spinner loading-sm"
          role="status"
        ></span>
      ) : isFollowing ? (
        'フォロー解除'
      ) : (
        'フォロー'
      )}
    </button>
  )
}
