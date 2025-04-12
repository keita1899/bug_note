import Image from 'next/image'
import Link from 'next/link'
import { FaTrash } from 'react-icons/fa'
import { Notification } from '@/features/notification/types/Notification'
import { useNotificationMessage } from '@/hooks/useNotificationMessage'

type Props = {
  notification: Notification
  isUpdating: boolean
  onNotificationClick: (notification: Notification) => void
  onDelete: (notification: Notification) => void
}

export const NotificationListItem = ({
  notification,
  isUpdating,
  onNotificationClick,
  onDelete,
}: Props) => {
  const { getMessage } = useNotificationMessage()
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(notification)
  }

  return (
    <button
      onClick={() => onNotificationClick(notification)}
      className={`w-full rounded-lg p-4 text-left transition-colors ${
        notification.read
          ? 'bg-base-100 hover:bg-base-100'
          : 'bg-blue-50 hover:bg-blue-100'
      }`}
      disabled={isUpdating}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/users/${notification.actor?.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={notification.actor?.imageUrl || '/images/default-avatar.png'}
              alt={notification.actor?.name || 'ユーザー'}
              width={40}
              height={40}
              className="size-10 rounded-full transition-opacity hover:opacity-80"
              unoptimized
            />
          </Link>
          <div>
            <p className="text-sm text-gray-600">{getMessage(notification)}</p>
            <p className="mt-1 text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!notification.read && (
            <div className="size-2 rounded-full bg-blue-500" />
          )}
          {notification.read && (
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 transition-colors hover:text-red-500"
              disabled={isUpdating}
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </button>
  )
}
