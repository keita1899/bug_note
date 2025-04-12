import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { FaPen, FaBell } from 'react-icons/fa'
import { Notification } from '@/features/notification/types/Notification'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationMessage } from '@/hooks/useNotificationMessage'
import { useNotificationRead } from '@/hooks/useNotificationRead'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'

export const Header = () => {
  const { currentUser, isFetched, isAuthenticated, signout } = useAuth()
  const { markAsRead } = useNotificationRead()
  const { getMessage } = useNotificationMessage()

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => fetcher(API_URLS.MYPAGE.NOTIFICATIONS.HEADER),
    enabled: isAuthenticated,
  })

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id.toString())
    }
  }

  const unreadCount =
    notifications?.filter((notification) => !notification.read).length || 0

  return (
    <div className="navbar bg-base-100 shadow-xl">
      <div className="flex-1">
        <Link href="/bugs" className="btn btn-ghost text-xl">
          Bug Note
        </Link>
      </div>
      <div className="flex-none">
        {isFetched && (
          <>
            {isAuthenticated ? (
              <>
                <Link href="/bugs/new">
                  <button className="btn btn-circle btn-ghost">
                    <FaPen className="text-xl text-primary" />
                  </button>
                </Link>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-circle btn-ghost"
                  >
                    <div className="indicator">
                      <FaBell className="text-xl" />
                      {unreadCount > 0 && (
                        <span className="badge indicator-item badge-sm bg-red-500 text-white">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-80 bg-base-100 p-2 shadow"
                  >
                    {notifications?.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`cursor-pointer p-3 hover:bg-gray-100 ${
                          notification.read ? 'bg-white' : 'bg-blue-50'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={`/users/${notification.actor?.id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Image
                                src={
                                  notification.actor?.imageUrl ||
                                  '/images/default-avatar.png'
                                }
                                alt={notification.actor?.name || 'ユーザー'}
                                width={32}
                                height={32}
                                className="size-8 rounded-full transition-opacity hover:opacity-80"
                                unoptimized
                              />
                            </Link>
                            <div>
                              <p className="text-sm text-gray-600">
                                {getMessage(notification)}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="size-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                    <li className="text-center">
                      <Link href="/mypage/notifications" className="text-sm">
                        通知一覧を見る
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="avatar btn btn-circle btn-ghost"
                  >
                    <div className="w-10 rounded-full">
                      <Image
                        src={
                          currentUser?.imageUrl || '/images/default-avatar.png'
                        }
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
                  >
                    <li>
                      <span className="border-b font-bold">
                        {currentUser?.name}
                      </span>
                    </li>
                    <li>
                      <Link href="/mypage" className="justify-between">
                        マイページ
                      </Link>
                    </li>
                    <li>
                      <button onClick={signout}>ログアウト</button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link href="/auth/signup">新規登録</Link>
                </li>
                <li>
                  <Link href="/auth/signin">ログイン</Link>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
