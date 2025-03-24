import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MypageLayout } from '@/components/MypageLayout'
import { Loading } from '@/components/utilities/Loading'
import { NoData } from '@/components/utilities/NoData'
import { Pagination } from '@/components/utilities/Pagination'
import { BugList } from '@/features/bugs/components/BugList'
import { BugListItem } from '@/features/bugs/types/BugListItem'
import { Tab } from '@/features/mypage/types/Tab'
import { TabValue } from '@/features/mypage/types/TabValue'
import { Tabs } from '@/features/mypage/ui/Tabs'
import { useRequiredSignedIn } from '@/hooks/useRequiredSignedIn'
import { Meta } from '@/types/Meta'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'

const tabs: Tab<TabValue>[] = [
  {
    label: `全て`,
    value: 'all',
  },
  {
    label: '未解決',
    value: 'unsolved',
  },
  {
    label: '解決済',
    value: 'solved',
  },
  {
    label: '下書き',
    value: 'draft',
  },
  {
    label: '公開',
    value: 'published',
  },
  {
    label: 'いいね',
    value: 'liked',
  },
]

const Mypage = () => {
  useRequiredSignedIn()
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1
  const [selectedTab, setSelectedTab] = useState<TabValue>('all')

  const { data, isPending, isFetching } = useQuery<{
    bugs: BugListItem[]
    meta: Meta
  }>({
    queryKey: ['bugs', selectedTab, page],
    queryFn: () => fetcher(API_URLS.MYPAGE.BUG(selectedTab, page)),
  })

  const handleChangePage = (page: number) => {
    router.push(`/mypage?page=${page}`)
  }

  useEffect(() => {
    router.push(`/mypage?page=1`, undefined, {
      shallow: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab])

  return (
    <MypageLayout>
      <div className="mt-8 flex justify-center">
        <Tabs<TabValue>
          tabs={tabs}
          selectedTab={selectedTab}
          onClick={setSelectedTab}
        />
      </div>

      <div className="mt-4 text-right font-bold text-gray-600">
        <span className="text-2xl">{data?.bugs?.length}</span>件 /{' '}
        <span className="text-2xl">{data?.meta?.totalCount}</span>件
      </div>

      {isPending || isFetching ? (
        <Loading />
      ) : data?.bugs?.length ? (
        <div className="mt-8">
          <BugList bugs={data.bugs} />
          <div className="flex justify-center py-10">
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
    </MypageLayout>
  )
}
export default Mypage
