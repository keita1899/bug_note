import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'

const ServerErrorPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-96 rounded-lg bg-white p-6 text-center shadow-lg">
          <h1 className="mb-4 text-5xl font-bold text-red-600">500</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-600">
            Internal Server Error
          </h2>
          <h2 className="mb-4 text-xl font-semibold">
            サーバーエラーが発生しました
          </h2>
          <p className="mb-6 text-gray-600">
            申し訳ありませんが、システムに技術的な問題が発生しました。復旧までしばらくお待ちください。
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

export default ServerErrorPage
