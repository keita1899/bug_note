import Link from 'next/link'
import { Notification } from '@/features/notification/types/Notification'

const getNotifiableLink = (notification: Notification) => {
  if (notification.notifiable.bugId) {
    return `/bugs/${notification.notifiable.bugId}`
  }
  return '#'
}

export const useNotificationMessage = () => {
  const getMessage = (notification: Notification) => {
    if (!notification.actor) return ''

    const actorName = `${notification.actor.name}さんが`
    const title = notification.notifiable.title
    const link = (
      <Link
        href={getNotifiableLink(notification)}
        onClick={(e) => e.stopPropagation()}
        className="text-blue-500 hover:underline"
      >
        {title}
      </Link>
    )

    switch (notification.action) {
      case 'liked':
        return (
          <>
            {actorName}「{link}」にいいねしました
          </>
        )
      case 'followed':
        return `${actorName}フォローしました`
      case 'commented':
        return (
          <>
            {actorName}「{link}」にコメントしました
          </>
        )
      case 'published':
        return `${actorName}バグを投稿しました`
      default:
        return ''
    }
  }

  return { getMessage }
}
