import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Layout } from '@/components/Layout'
import { Loading } from '@/components/utilities/Loading'
import { NoData } from '@/components/utilities/NoData'
import { Pagination } from '@/components/utilities/Pagination'
import { BugList } from '@/features/bugs/components/BugList'
import { BugListItem } from '@/features/bugs/types/BugListItem'
import { FollowButton } from '@/features/user/components/FollowButton'
import { useAuth } from '@/hooks/useAuth'
import { Meta } from '@/types/Meta'
import { User } from '@/types/User'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

type UserDetailType = User & {
  followersCount: number
  followingCount: number
}

const UserDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const page = 'page' in router.query ? Number(router.query.page) : 1
  const { currentUser } = useAuth()

  const { data: user, isPending: isUserPending } = useQuery<UserDetailType>({
    queryKey: ['user', id],
    queryFn: () => fetcher(API_URLS.USER.SHOW(String(id))),
    enabled: !!id,
  })

  const { data, isPending: isBugPending } = useQuery<{
    bugs: BugListItem[] | undefined
    meta: Meta
  }>({
    queryKey: ['bugs', id, page],
    queryFn: () => fetcher(API_URLS.USER.BUG(String(id), page)),
    enabled: !!id,
  })

  const handleChangePage = (page: number) => {
    router.push(`/users/${id}/bugs?page=${page}`)
  }

  const queryClient = useQueryClient()

  const follow = useMutation({
    mutationFn: async (userId: number) => {
      const res = await axios.post(
        API_URLS.CURRENT.FOLLOW,
        { id: userId },
        { headers: getAuthHeaders() ?? {} },
      )
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user', id],
      })
    },
  })

  const unfollow = useMutation({
    mutationFn: async (userId: number) => {
      const res = await axios.delete(API_URLS.CURRENT.UNFOLLOW, {
        data: { id: userId },
        headers: getAuthHeaders() ?? {},
      })
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user', id],
      })
    },
  })

  const handleFollow = (userId: number) => {
    follow.mutate(userId)
  }

  const handleUnfollow = (userId: number) => {
    unfollow.mutate(userId)
  }

  return (
    <Layout>
      {isUserPending || isBugPending ? (
        <Loading />
      ) : (
        <div className="mx-auto my-12 w-full max-w-full p-4 md:max-w-4xl lg:max-w-3xl">
          <div className="mx-auto max-w-xl">
            <div className="flex items-center gap-4">
              <Image
                src={user?.imageUrl || '/images/default-avatar.png'}
                alt={user?.name || 'User Avatar'}
                width={96}
                height={96}
                className="rounded-full"
                priority
                unoptimized
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                {user?.nickname && (
                  <p className="mt-1 text-gray-600">{user.nickname}</p>
                )}
                <div className="mt-4 text-right">
                  {currentUser?.id !== user?.id && user && (
                    <FollowButton
                      isFollowing={user.isFollowing}
                      isLoading={follow.isPending || unfollow.isPending}
                      onFollow={() => handleFollow(user.id)}
                      onUnfollow={() => handleUnfollow(user.id)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {user?.bio && (
                <div className="whitespace-pre-wrap rounded-lg bg-white p-4 shadow">
                  {user.bio}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {user?.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      className="size-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {user?.websiteUrl && (
                  <a
                    href={user.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-4 text-lg">
              <Link href={`/users/${id}/follows?tab=following`}>
                <div className="cursor-pointer underline">
                  フォロー{' '}
                  <span className="font-bold">{user?.followingCount}</span>
                </div>
              </Link>
              <Link href={`/users/${id}/follows?tab=followers`}>
                <div className="cursor-pointer underline">
                  フォロワー{' '}
                  <span className="font-bold">{user?.followersCount}</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-8 text-right font-bold text-gray-600">
            <span className="text-2xl">{data?.bugs?.length}</span>件 /{' '}
            <span className="text-2xl">{data?.meta?.totalCount}</span>件
          </div>

          {data?.bugs && data.bugs.length > 0 ? (
            <div className="mt-8">
              <BugList bugs={data.bugs} />
              <div className="flex justify-center py-6">
                <Pagination
                  totalPages={data.meta.totalPages}
                  currentPage={data.meta.currentPage}
                  onChange={handleChangePage}
                />
              </div>
            </div>
          ) : (
            <NoData />
          )}
        </div>
      )}
    </Layout>
  )
}

export default UserDetail
