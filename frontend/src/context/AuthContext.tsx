import { createContext } from 'react'
import { CurrentUser } from '@/types/CurrentUser'

export type AuthContextType = {
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  isFetched: boolean
  setCurrentUser: (currentUser: CurrentUser) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  signout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
