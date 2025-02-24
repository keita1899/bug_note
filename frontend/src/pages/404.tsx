import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'

const NotFoundPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-96 rounded-lg bg-white p-6 text-center shadow-lg">
          <h1 className="mb-4 text-5xl font-bold text-purple-600">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-600">
            Not Found
          </h2>
          <h2 className="mb-4 text-xl font-semibold">
            ページが見つかりませんでした
          </h2>
          <p className="mb-6 text-gray-600">
            申し訳ありませんが、リクエストされたページは存在しません。
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary btn-lg w-full"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage
