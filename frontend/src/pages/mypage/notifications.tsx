import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MypageLayout } from '@/components/MypageLayout'
import { NotificationListItem } from '@/components/notifications/NotificationListItem'
import { DeleteModal } from '@/components/utilities/DeleteModal'
import { Loading } from '@/components/utilities/Loading'
import { NoData } from '@/components/utilities/NoData'
import { Pagination } from '@/components/utilities/Pagination'
import { Tab } from '@/features/mypage/types/Tab'
import { NotificationTabValue } from '@/features/mypage/types/TabValue'
import { Tabs } from '@/features/mypage/ui/Tabs'
import { Notification } from '@/features/notification/types/Notification'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationRead } from '@/hooks/useNotificationRead'
import { useRequiredSignedIn } from '@/hooks/useRequiredSignedIn'
import { Meta } from '@/types/Meta'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

const tabs: Tab<NotificationTabValue>[] = [
  {
    label: `全て`,
    value: 'all',
  },
  {
    label: '未読',
    value: 'unread',
  },
  {
    label: '既読',
    value: 'read',
  },
]

const Notifications = () => {
  useRequiredSignedIn()
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null)
  const page = Number(router.query.page) || 1
  const tab = (router.query.tab as NotificationTabValue) || 'all'
  const { markAsRead, isUpdating } = useNotificationRead()

  const { data, isPending } = useQuery<{
    notifications: Notification[]
    meta: Meta
  }>({
    queryKey: ['notifications', page, tab],
    queryFn: () => fetcher(API_URLS.MYPAGE.NOTIFICATIONS.INDEX(page, tab)),
    enabled: !!currentUser,
  })

  const { mutate: deleteNotification, isPending: isDeleting } = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await axios.delete(
        API_URLS.MYPAGE.NOTIFICATIONS.DELETE(notificationId),
        {
          headers: getAuthHeaders() ?? {},
        },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id.toString())
    }
  }

  const handleDelete = (notification: Notification) => {
    setNotificationToDelete(notification)
  }

  const handleDeleteConfirm = () => {
    if (notificationToDelete && !isDeleting) {
      deleteNotification(notificationToDelete.id.toString())
      setNotificationToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setNotificationToDelete(null)
  }

  const handlePageChange = (newPage: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    })
  }

  const handleTabChange = (tab: NotificationTabValue) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: tab, page: 1 },
    })
  }

  if (isPending) {
    return (
      <MypageLayout>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mt-8 flex justify-center">
              <Tabs tabs={tabs} selectedTab={tab} onClick={handleTabChange} />
            </div>
            <Loading message="通知を読み込み中..." />
          </div>
        </div>
      </MypageLayout>
    )
  }

  return (
    <MypageLayout>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mt-8 flex justify-center">
            <Tabs tabs={tabs} selectedTab={tab} onClick={handleTabChange} />
          </div>
          <div className="mt-4 text-right font-bold text-gray-600">
            <span className="text-2xl">{data?.notifications?.length}</span>件 /{' '}
            <span className="text-2xl">{data?.meta?.totalCount}</span>件
          </div>
          {!data || data.notifications.length === 0 ? (
            <NoData message="通知はありません" />
          ) : (
            <>
              <div className="mt-8 space-y-4">
                {data.notifications.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    isUpdating={isUpdating || isDeleting}
                    onNotificationClick={handleNotificationClick}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <div className="flex justify-center py-10">
                <Pagination
                  currentPage={data.meta.currentPage}
                  totalPages={data.meta.totalPages}
                  onChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {notificationToDelete && (
        <DeleteModal
          title="通知を削除"
          description="この通知を削除してもよろしいですか？"
          onClose={handleDeleteCancel}
          onClick={handleDeleteConfirm}
        />
      )}
    </MypageLayout>
  )
}

export default Notifications
