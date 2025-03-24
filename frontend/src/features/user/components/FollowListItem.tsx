import Image from 'next/image'
import Link from 'next/link'
import { FollowButton } from './FollowButton'
import { User } from '@/types/User'

type FollowListItemProps = {
  user: User
  isLoading: boolean
  currentUserId?: number
  onFollow: (userId: number) => void
  onUnfollow: (userId: number) => void
}

export const FollowListItem = ({
  user,
  isLoading,
  currentUserId,
  onFollow,
  onUnfollow,
}: FollowListItemProps) => {
  return (
    <li className="mb-4 flex h-[64px] items-center justify-between rounded-md bg-base-100 p-4 shadow-xl">
      <div className="flex grow items-center">
        <Image
          src={user.image || '/images/default-avatar.png'}
          alt={user.name}
          width={40}
          height={40}
          className="mr-4 rounded-full"
        />
        <Link href={`/users/${user.id}`} className="text-sm font-medium">
          {user.name || 'aaaaaaaaaaaaaaa'}
        </Link>
      </div>
      {user.id !== currentUserId && (
        <FollowButton
          isFollowing={user.isFollowing}
          isLoading={isLoading}
          onFollow={() => onFollow(user.id)}
          onUnfollow={() => onUnfollow(user.id)}
        />
      )}
    </li>
  )
}
