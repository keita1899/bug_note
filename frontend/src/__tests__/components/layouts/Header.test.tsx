import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '@/components/layouts/Header'
import { AuthContext } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'

jest.mock('@/hooks/useAuth')
jest.mock('@/hooks/useNotificationRead', () => ({
  useNotificationRead: () => ({
    markAsRead: jest.fn(),
  }),
}))
jest.mock('@/hooks/useNotificationMessage', () => ({
  useNotificationMessage: () => ({
    getMessage: jest.fn(),
  }),
}))
jest.mock('@/utils', () => ({
  fetcher: jest.fn(),
}))
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: (key: string) => {
    if (key === 'notifications') {
      return { data: [], isLoading: false, error: null }
    }
    return { data: null, isLoading: false, error: null }
  },
}))

describe('Header', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  it('未認証の場合、ログインと新規登録リンクが表示されること', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isFetched: true,
      isAuthenticated: false,
      signout: jest.fn(),
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            currentUser: null,
            isAuthenticated: false,
            isFetched: true,
            setCurrentUser: jest.fn(),
            setIsAuthenticated: jest.fn(),
            signout: jest.fn(),
          }}
        >
          <Header />
        </AuthContext.Provider>
      </QueryClientProvider>,
    )

    expect(screen.getByText('新規登録')).toBeInTheDocument()
    expect(screen.getByText('ログイン')).toBeInTheDocument()
  })

  it('認証済みの場合、ユーザーのマイページとログアウトが表示されること', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isFetched: true,
      isAuthenticated: true,
      signout: jest.fn(),
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            currentUser: { id: 1, name: 'Test User', imageUrl: 'test.com' },
            isAuthenticated: true,
            isFetched: true,
            setCurrentUser: jest.fn(),
            setIsAuthenticated: jest.fn(),
            signout: jest.fn(),
          }}
        >
          <Header />
        </AuthContext.Provider>
      </QueryClientProvider>,
    )

    expect(screen.getByText('マイページ')).toBeInTheDocument()
    expect(screen.getByText('ログアウト')).toBeInTheDocument()
  })

  it('ログアウトボタンをクリックするとsignout関数が呼ばれること', () => {
    const mockSignout = jest.fn()

    ;(useAuth as jest.Mock).mockReturnValue({
      isFetched: true,
      isAuthenticated: true,
      signout: mockSignout,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            currentUser: { id: 1, name: 'Test User', imageUrl: 'test.com' },
            isAuthenticated: true,
            isFetched: true,
            setCurrentUser: jest.fn(),
            setIsAuthenticated: jest.fn(),
            signout: mockSignout,
          }}
        >
          <Header />
        </AuthContext.Provider>
      </QueryClientProvider>,
    )

    fireEvent.click(screen.getByText('ログアウト'))

    expect(mockSignout).toHaveBeenCalledTimes(1)
  })
})
