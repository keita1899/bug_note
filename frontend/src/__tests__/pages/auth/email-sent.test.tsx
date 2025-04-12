import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import EmailSent from '@/pages/auth/email-sent'
import { AuthProvider } from '@/providers/AuthProvider'

jest.mock('@/utils', () => ({
  fetcher: jest.fn(),
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('EmailSent', () => {
  it('確認メッセージが表示されること', () => {
    const queryClient = new QueryClient({})

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <EmailSent />,
        </AuthProvider>
      </QueryClientProvider>,
    )

    expect(screen.getByText('確認メールを送信しました')).toBeInTheDocument()

    expect(
      screen.getByText(
        '登録が完了しました。メールボックスに届いた確認メールを開き、リンクをクリックしてアカウントを有効化してください。',
      ),
    ).toBeInTheDocument()
  })
})
