import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
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

type User = {
  id: number
  image: string
  name: string
}

const UserDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const { data: user, isPending: isUserPending } = useQuery<User>({
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

  return (
    <Layout>
      {isUserPending || isBugPending ? (
        <Loading />
      ) : (
        <div className="mx-auto my-12 w-full max-w-full p-4 md:max-w-4xl lg:max-w-3xl">
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
              <button className="btn btn-primary mt-4">フォローする</button>
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
