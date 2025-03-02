import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '@/components/layouts/Header'
import { AuthContext } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'

jest.mock('@/hooks/useAuth')

describe('Header', () => {
  it('未認証の場合、ログインと新規登録リンクが表示されること', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isFetched: true,
      isAuthenticated: false,
      signout: jest.fn(),
    })

    render(
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
      </AuthContext.Provider>,
    )

    expect(screen.getByText('新規登録')).toBeInTheDocument()
    expect(screen.getByText('ログイン')).toBeInTheDocument()
  })

  it('認証済みの場合、ユーザーのプロフィールとログアウトが表示されること', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isFetched: true,
      isAuthenticated: true,
      signout: jest.fn(),
    })

    render(
      <AuthContext.Provider
        value={{
          currentUser: { id: 1, name: 'Test User', email: 'test@example.com' },
          isAuthenticated: true,
          isFetched: true,
          setCurrentUser: jest.fn(),
          setIsAuthenticated: jest.fn(),
          signout: jest.fn(),
        }}
      >
        <Header />
      </AuthContext.Provider>,
    )

    expect(screen.getByText('プロフィール')).toBeInTheDocument()
    expect(screen.getByText('設定')).toBeInTheDocument()
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
      <AuthContext.Provider
        value={{
          currentUser: { id: 1, name: 'Test User', email: 'test@example.com' },
          isAuthenticated: true,
          isFetched: true,
          setCurrentUser: jest.fn(),
          setIsAuthenticated: jest.fn(),
          signout: mockSignout,
        }}
      >
        <Header />
      </AuthContext.Provider>,
    )

    fireEvent.click(screen.getByText('ログアウト'))

    expect(mockSignout).toHaveBeenCalledTimes(1)
  })
})
