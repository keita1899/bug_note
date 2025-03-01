import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { NextRouter, useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Confirmation from '@/pages/auth/confirmation'
import { AuthProvider } from '@/providers/AuthProvider'

jest.mock('axios')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Confirmation', () => {
  let mockRouter: NextRouter

  beforeEach(() => {
    mockRouter = {
      query: {},
      isReady: true,
      push: jest.fn(),
    } as unknown as NextRouter
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('ローディングメッセージが表示される', () => {
    render(
      <AuthProvider>
        <Confirmation />
      </AuthProvider>,
    )
    expect(
      screen.getByText('アカウントを有効化しています...'),
    ).toBeInTheDocument()
  })

  it('確認トークンがある場合、API にリクエストを送信する', async () => {
    mockRouter.query['confirmation_token'] = 'valid_token'
    ;(axios.patch as jest.Mock).mockResolvedValue({})

    render(
      <AuthProvider>
        <Confirmation />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/user/confirmations'),
        { confirmation_token: 'valid_token' },
      )
      expect(toast.success).toHaveBeenCalledWith(
        'アカウントが有効化されました。',
      )
      expect(mockRouter.push).toHaveBeenCalledWith('/signin')
    })
  })

  it('API リクエストが失敗した場合、エラーメッセージを表示しリダイレクトする', async () => {
    mockRouter.query['confirmation_token'] = 'invalid_token'
    ;(axios.patch as jest.Mock).mockRejectedValue({
      response: { data: { message: '予期しないエラーが発生しました' } },
    })

    render(
      <AuthProvider>
        <Confirmation />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('予期しないエラーが発生しました')
      expect(mockRouter.push).toHaveBeenCalledWith('/')
    })
  })

  it('確認トークンがない場合、エラーメッセージを表示しリダイレクトする', async () => {
    mockRouter.query = {}

    render(
      <AuthProvider>
        <Confirmation />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('確認トークンが存在しません')
      expect(mockRouter.push).toHaveBeenCalledWith('/')
    })
  })
})
