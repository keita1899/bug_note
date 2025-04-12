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
      className={`group btn w-24 p-0.5 text-xs transition-colors duration-300 md:w-32 md:p-2 md:text-base ${
        isFollowing
          ? 'bg-black text-white hover:bg-red-600'
          : 'bg-gray-200 text-black hover:bg-gray-300'
      }`}
      disabled={isLoading}
      onClick={isFollowing ? onUnfollow : onFollow}
    >
      {isLoading ? (
        <span
          className="loading loading-spinner loading-sm"
          role="status"
        ></span>
      ) : isFollowing ? (
        <>
          <span className="group-hover:hidden">フォロー中</span>
          <span className="hidden group-hover:inline">フォロー解除</span>
        </>
      ) : (
        'フォロー'
      )}
    </button>
  )
}
