import { BugListItem as BugListItemType } from '../types/BugListItem'

type BugListItemProps = Omit<BugListItemType, 'id'>

export const BugListItem = ({ title, createdAt, user }: BugListItemProps) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">投稿日: {createdAt}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="avatar">
            <div className="size-12 rounded-full">
              {/* <img src={user.image} alt={user.nickname} /> */}
            </div>
          </div>
          <p className="font-medium">{user.nickname}</p>
        </div>
      </div>
    </div>
  )
}
