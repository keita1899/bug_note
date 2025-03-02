import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './useAuth'

export const useRequiredSignedIn = () => {
  const router = useRouter()
  const { isFetched, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isFetched && !isAuthenticated) {
      toast.error('ログインしてください')
      router.push('/auth/signin')
    }
  }, [router, isFetched, isAuthenticated])
}
