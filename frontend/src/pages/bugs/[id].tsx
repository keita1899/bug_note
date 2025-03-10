import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import { Loading } from '@/components/utilities/Loading'
import { NoData } from '@/components/utilities/NoData'
import { Bug } from '@/features/bugs/types/Bug'
import { BugSection } from '@/features/bugs/ui/BugSection'
import { BugStatus } from '@/features/bugs/ui/BugStatus'
import { EnvironmentTable } from '@/features/bugs/ui/EnvironmentTable'
import { useAuth } from '@/hooks/useAuth'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'

const BugDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const { currentUser } = useAuth()

  const { data: bug, isPending } = useQuery<Bug>({
    queryKey: ['bug', id],
    queryFn: () => fetcher(API_URLS.BUG.SHOW(String(id))),
  })

  return (
    <Layout>
      {isPending ? (
        <Loading />
      ) : bug ? (
        <div className="mx-auto max-w-4xl p-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              {currentUser?.id === bug.user.id && (
                <BugStatus isSolved={bug.isSolved} status={bug.status} />
              )}
              <p className="text-sm text-gray-500">{`${new Date(bug?.createdAt).toLocaleDateString()} に投稿`}</p>
              <h2 className="card-title text-3xl">{bug?.title}</h2>
              <div className="my-4 space-y-20">
                <EnvironmentTable environments={bug?.environments || []} />
                <BugSection
                  title="エラーメッセージ"
                  content={bug?.errorMessage}
                />
                <BugSection title="エラー内容" content={bug?.content} />
                <BugSection
                  title="やりたいこと"
                  content={bug?.expectedBehavior}
                />
                <BugSection title="試したこと">
                  <ul>
                    {bug?.attempts?.map((attempt, index) => (
                      <li key={index} className="mb-2">
                        <p>{attempt.content}</p>
                      </li>
                    ))}
                  </ul>
                </BugSection>
                <BugSection title="解決方法" content={bug?.solution} />
                <BugSection title="原因" content={bug?.cause} />
                <BugSection title="参考リンク">
                  <ul>
                    {bug?.references?.map((reference, index) => (
                      <li key={index} className="mb-2">
                        <a
                          href={reference.url}
                          target="_blank"
                          className="text-blue-500 hover:underline"
                          rel="noreferrer"
                        >
                          {reference.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </BugSection>
                <BugSection title="その他" content={bug?.etc} />
              </div>

              <div className="mt-4 text-sm text-gray-500">
                {`作成者: ${bug?.user.nickname}`}
              </div>
            </div>
          </div>
          {bug?.user.id === currentUser?.id && (
            <div className="mt-10 flex justify-end gap-2">
              <button className="btn bg-black px-10 text-white">削除</button>
              <button className="btn btn-primary px-10">編集</button>
            </div>
          )}
        </div>
      ) : (
        <NoData />
      )}
    </Layout>
  )
}
export default BugDetail
