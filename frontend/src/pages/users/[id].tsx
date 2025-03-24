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
                src={user?.image || '/images/default-avatar.png'}
                alt={user?.name || 'User Avatar'}
                width={96}
                height={96}
                className="rounded-full"
                priority
              />
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
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
