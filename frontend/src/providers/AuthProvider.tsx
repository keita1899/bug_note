import axios from 'axios'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '@/context/AuthContext'
import { CurrentUser } from '@/types/CurrentUser'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFetched, setIsFetched] = useState(false)

  const fetchCurrentUser = async () => {
    console.log('fetchCurrentUser')
    try {
      const response = await axios.get(API_URLS.AUTH.CURRENT_USER, {
        headers: getAuthHeaders() ?? {},
      })

      setCurrentUser(response.data)
      setIsAuthenticated(true)
      setIsFetched(true)
    } catch (error) {
      setCurrentUser(null)
      setIsAuthenticated(false)
      setIsFetched(true)
    }
  }

  const signout = () => {
    localStorage.removeItem('access-token')
    localStorage.removeItem('uid')
    localStorage.removeItem('client')
    setCurrentUser(null)
    setIsAuthenticated(false)
    toast.success('ログアウトしました')
    router.push('/auth/signin')
  }

  useEffect(() => {
    if (isFetched) return

    if (!localStorage.getItem('access-token')) {
      setIsFetched(true)
      return
    }

    fetchCurrentUser()
  }, [isFetched])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isFetched,
        setCurrentUser,
        setIsAuthenticated,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
