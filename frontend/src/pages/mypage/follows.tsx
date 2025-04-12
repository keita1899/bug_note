import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MypageLayout } from '@/components/MypageLayout'
import { Loading } from '@/components/utilities/Loading'
import { NoData } from '@/components/utilities/NoData'
import { Tab } from '@/features/mypage/types/Tab'
import { FollowTabValue } from '@/features/mypage/types/TabValue'
import { Tabs } from '@/features/mypage/ui/Tabs'
import { FollowList } from '@/features/user/components/FollowList'
import { useAuth } from '@/hooks/useAuth'
import { useRequiredSignedIn } from '@/hooks/useRequiredSignedIn'
import { User } from '@/types/User'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

const tabs: Tab<FollowTabValue>[] = [
  {
    label: 'フォロー',
    value: 'following',
  },
  {
    label: 'フォロワー',
    value: 'followers',
  },
]

const FollowIndex = () => {
  useRequiredSignedIn()
  const router = useRouter()
  const { tab } = router.query
  const [selectedTab, setSelectedTab] = useState<FollowTabValue>('following')
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  const currentUserId = currentUser?.id

  useEffect(() => {
    if (tab) {
      setSelectedTab(tab as FollowTabValue)
    }
  }, [tab])

  const { data, isPending, isFetching } = useQuery<User[]>({
    queryKey: ['follows', selectedTab],
    queryFn: () => {
      if (selectedTab === 'following') {
        return fetcher(API_URLS.USER.FOLLOWING(String(currentUserId)))
      }
      if (selectedTab === 'followers') {
        return fetcher(API_URLS.USER.FOLLOWERS(String(currentUserId)))
      }
      return Promise.reject('Invalid tab')
    },
    enabled: !!currentUserId,
  })

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
        queryKey: ['follows', selectedTab],
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
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['follows', selectedTab],
      })
    },
  })

  const handleFollow = (userId: number) => {
    follow.mutate(userId)
  }

  const handleUnfollow = (userId: number) => {
    unfollow.mutate(userId)
  }

  const handleTabChange = (tabValue: FollowTabValue) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: tabValue },
    })
  }

  return (
    <MypageLayout>
      <div className="mx-auto w-full max-w-full md:max-w-4xl lg:max-w-3xl">
        <div className="mt-8 flex justify-center">
          <Tabs<FollowTabValue>
            tabs={tabs}
            selectedTab={selectedTab}
            onClick={handleTabChange}
          />
        </div>

        <div className="p-4">
          {isFetching && <Loading />}
          {selectedTab === 'following' ? (
            <div className="mt-4">
              {data?.length === 0 ? (
                <NoData message="フォローしているユーザーはいません" />
              ) : (
                <FollowList
                  users={data ?? []}
                  isLoading={isPending}
                  currentUserId={currentUser?.id}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                />
              )}
            </div>
          ) : (
            <div className="mt-4">
              {data?.length === 0 ? (
                <NoData message="フォロワーはいません" />
              ) : (
                <FollowList
                  users={data ?? []}
                  isLoading={isPending}
                  currentUserId={currentUser?.id}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </MypageLayout>
  )
}

export default FollowIndex
