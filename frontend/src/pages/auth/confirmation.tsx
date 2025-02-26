import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Layout } from '@/components/Layout'
import { Loading } from '@/components/utilities/Loading'
import { API_URLS } from '@/utils/api'

const Confirmation = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const token = router.query['confirmation_token']
    if (token) {
      const confirmAccount = async () => {
        try {
          await axios.patch(API_URLS.AUTH.CONFIRMATION, {
            confirmation_token: token,
          })
          toast.success('アカウントが有効化されました。')
          router.push('/signin')
        } catch (error) {
          if (error instanceof AxiosError) {
            toast.error(
              error.response?.data?.message || '予期しないエラーが発生しました',
            )
          } else {
            toast.error('予期しないエラーが発生しました')
          }
          router.push('/')
        }
      }
      confirmAccount()
    } else {
      toast.error('確認トークンが存在しません')
      router.push('/')
    }
  }, [router.query])

  return (
    <Layout>
      <Loading message="アカウントを有効化しています..." />
    </Layout>
  )
}

export default Confirmation
