import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '@/context/AuthContext'
import { AuthProvider } from '@/providers/AuthProvider'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

jest.mock('axios')
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('初期状態で currentUser が null で isAuthenticated が false で isFetched が true であること', () => {
    const TestComponent = () => {
      const contextValue = useContext(AuthContext)
      return (
        <>
          <div>{`currentUser: ${JSON.stringify(contextValue?.currentUser)}`}</div>
          <div>{`isAuthenticated: ${contextValue?.isAuthenticated}`}</div>
          <div>{`isFetched: ${contextValue?.isFetched}`}</div>
        </>
      )
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    expect(screen.getByText('currentUser: null')).toBeInTheDocument()
    expect(screen.getByText('isAuthenticated: false')).toBeInTheDocument()
    expect(screen.getByText('isFetched: true')).toBeInTheDocument()
  })

  it('localStorage に認証情報がある場合 fetchCurrentUser が呼ばれること', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
    ;(axios.get as jest.Mock).mockResolvedValue({ data: mockUser })

    localStorage.setItem('access-token', 'test-token')
    localStorage.setItem('client', 'test-client')
    localStorage.setItem('uid', 'test-uid')

    const TestComponent = () => {
      const contextValue = useContext(AuthContext)
      return (
        <>
          <div>{`currentUser: ${JSON.stringify(contextValue?.currentUser)}`}</div>
          <div>{`isAuthenticated: ${contextValue?.isAuthenticated}`}</div>
          <div>{`isFetched: ${contextValue?.isFetched}`}</div>
        </>
      )
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(API_URLS.AUTH.CURRENT_USER, {
        headers: getAuthHeaders(),
      })
    })

    expect(
      screen.getByText(`currentUser: ${JSON.stringify(mockUser)}`),
    ).toBeInTheDocument()
    expect(screen.getByText('isAuthenticated: true')).toBeInTheDocument()
    expect(screen.getByText('isFetched: true')).toBeInTheDocument()
  })

  it('signout を呼ぶと認証情報がクリアされること', () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })

    const TestComponent = () => {
      const contextValue = useContext(AuthContext)
      return (
        <>
          <div>{`currentUser: ${JSON.stringify(contextValue?.currentUser)}`}</div>
          <div>{`isAuthenticated: ${contextValue?.isAuthenticated}`}</div>
          <div>{`isFetched: ${contextValue?.isFetched}`}</div>
          <button onClick={() => contextValue?.signout()}>Sign Out</button>
        </>
      )
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByText('Sign Out'))

    expect(localStorage.getItem('access-token')).toBeNull()
    expect(localStorage.getItem('client')).toBeNull()
    expect(localStorage.getItem('uid')).toBeNull()
    expect(screen.getByText('currentUser: null')).toBeInTheDocument()
    expect(screen.getByText('isAuthenticated: false')).toBeInTheDocument()
    expect(screen.getByText('isFetched: true')).toBeInTheDocument()
    expect(toast.success).toHaveBeenCalledWith('ログアウトしました')
    expect(mockPush).toHaveBeenCalledWith('/auth/signin')
  })
})
