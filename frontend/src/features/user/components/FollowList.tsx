import { FollowListItem } from './FollowListItem'
import { User } from '@/types/User'

type FollowListProps = {
  users: User[]
  isLoading: boolean
  currentUserId?: number
  onFollow: (userId: number) => void
  onUnfollow: (userId: number) => void
}

export const FollowList = ({
  users,
  isLoading,
  currentUserId,
  onFollow,
  onUnfollow,
}: FollowListProps) => {
  return (
    <ul>
      {users?.map((user) => (
        <FollowListItem
          key={user.id}
          user={user}
          isLoading={isLoading}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
          currentUserId={currentUserId}
        />
      ))}
    </ul>
  )
}
