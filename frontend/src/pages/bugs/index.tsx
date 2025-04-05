import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import { Loading } from '@/components/utilities/Loading'
import { NoData } from '@/components/utilities/NoData'
import { Pagination } from '@/components/utilities/Pagination'
import { BugList } from '@/features/bugs/components/BugList'
import { BugSearchForm } from '@/features/bugs/components/BugSearchForm'
import { BugListItem } from '@/features/bugs/types/BugListItem'
import { Meta } from '@/types/Meta'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'

const BugListPage = () => {
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1
  const keyword = 'keyword' in router.query ? String(router.query.keyword) : ''

  const { data, isPending } = useQuery<{ bugs: BugListItem[]; meta: Meta }>({
    queryKey: ['bugs', page, keyword],
    queryFn: () => fetcher(API_URLS.BUG.INDEX(page, keyword)),
  })

  const handleChangePage = (page: number) => {
    router.push('bugs?page=' + page)
  }

  return (
    <Layout>
      <div className="mx-auto my-12 w-full max-w-full p-4 md:max-w-4xl lg:max-w-3xl">
        <BugSearchForm />
        {!isPending && (
          <div className="my-8 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              {keyword ? (
                data?.meta?.totalCount ? (
                  <>
                    <span className="font-bold text-gray-900">
                      &quot;{keyword}&quot;
                    </span>
                    <span className="text-gray-600"> で </span>
                    <span className="font-bold text-primary">
                      {data.meta.totalCount}件
                    </span>
                    <span className="text-gray-600">
                      {' '}
                      のバグが見つかりました
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-gray-900">
                      &quot;{keyword}&quot;
                    </span>
                    <span className="text-gray-600">
                      {' '}
                      に一致するバグは見つかりませんでした
                    </span>
                  </>
                )
              ) : data?.meta?.totalCount ? (
                <>
                  <span className="font-bold text-primary">
                    {data.meta.totalCount}件
                  </span>
                  <span className="text-gray-600"> のバグが見つかりました</span>
                </>
              ) : (
                <span className="text-gray-600">
                  バグは見つかりませんでした
                </span>
              )}
            </p>
          </div>
        )}
        {isPending ? (
          <Loading />
        ) : data?.bugs && data.bugs?.length > 0 ? (
          <>
            <BugList bugs={data.bugs} />
            <div className="flex justify-center py-6">
              <Pagination
                totalPages={data.meta.totalPages}
                currentPage={data.meta.currentPage}
                onChange={handleChangePage}
              />
            </div>
          </>
        ) : (
          <NoData />
        )}
      </div>
    </Layout>
  )
}

export default BugListPage
