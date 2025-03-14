import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import { Loading } from '@/components/utilities/Loading'
import { NoData } from '@/components/utilities/NoData'
import { Pagination } from '@/components/utilities/Pagination'
import { BugList } from '@/features/bugs/components/BugList'
import { BugListItem } from '@/features/bugs/types/BugListItem'
import { Meta } from '@/types/Meta'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'

const BugListPage = () => {
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const { data, isPending } = useQuery<{ bugs: BugListItem[]; meta: Meta }>({
    queryKey: ['bugs', page],
    queryFn: () => fetcher(API_URLS.BUG.INDEX(page)),
  })

  const handleChangePage = (page: number) => {
    router.push('bugs?page=' + page)
  }

  return (
    <Layout>
      {isPending ? (
        <Loading />
      ) : data?.bugs && data.bugs?.length > 0 ? (
        <div className="mx-auto my-12 w-full max-w-full p-4 md:max-w-4xl lg:max-w-3xl">
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
    </Layout>
  )
}

export default BugListPage
