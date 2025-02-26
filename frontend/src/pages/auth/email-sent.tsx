import { Layout } from '@/components/Layout'

const EmailSent = () => {
  return (
    <Layout>
      <div className="mt-20 flex justify-center">
        <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-center text-2xl font-bold">
            確認メールを送信しました
          </h1>
          <p className="text-gray-600">
            登録が完了しました。メールボックスに届いた確認メールを開き、リンクをクリックしてアカウントを有効化してください。
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default EmailSent
