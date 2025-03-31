import Image from 'next/image'
import Link from 'next/link'
import { BugListItem as BugListItemType } from '../types/BugListItem'
import LikeButton from '@/components/utilities/LikeButton'

export const BugListItem = ({
  id,
  title,
  likeCount,
  isLiked,
  isSolved,
  status,
  createdAt,
  user,
}: BugListItemType) => {
  return (
    <Link href={`/bugs/${id}`} className="block">
      <div className="card relative w-full bg-base-100 shadow-xl">
        <div className="absolute right-8 top-4 flex gap-2">
          <div
            className={`w-16 px-3 py-1 text-center text-xs font-semibold text-white 
      ${isSolved ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {isSolved ? '解決済' : '未解決'}
          </div>

          <div
            className={`w-16 px-3 py-1 text-center text-xs font-semibold text-white 
      ${status === 'published' ? 'bg-blue-500' : 'bg-gray-500'}`}
          >
            {status === 'published' ? '公開' : '下書き'}
          </div>
        </div>

        <div className="card-body mt-4">
          <h3 className="card-title text-xl font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">投稿日: {createdAt}</p>
          <div className="mt-4 flex items-center gap-4">
            <Link href={`/users/${user.id}`}>
              <div className="avatar">
                <div className="size-10 rounded-full">
                  <Image
                    src={user.imageUrl || '/images/default-avatar.png'}
                    alt="User Avatar"
                    width={20}
                    height={20}
                    unoptimized
                  />
                </div>
              </div>
            </Link>
            <p className="font-medium">{user.nickname}</p>
            <LikeButton bugId={id} likeCount={likeCount} isLiked={isLiked} />
          </div>
        </div>
      </div>
    </Link>
  )
}
