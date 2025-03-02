import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SigninForm } from '@/features/auth/components/SigninForm'

describe('SigninForm', () => {
  const mockOnSubmit = jest.fn()

  it('フォームが正しく表示されること', () => {
    render(
      <SigninForm
        register={jest.fn()}
        handleSubmit={jest.fn()}
        errors={{}}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />,
    )

    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'ログイン' }),
    ).toBeInTheDocument()
  })

  it('フォームが送信されること', async () => {
    const mockHandleSubmit = jest.fn().mockImplementation((fn) => fn())
    render(
      <SigninForm
        register={jest.fn()}
        handleSubmit={mockHandleSubmit}
        errors={{}}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />,
    )

    fireEvent.input(screen.getByPlaceholderText('email@example.com'), {
      target: { value: 'test@example.com' },
    })

    fireEvent.input(screen.getByPlaceholderText('8文字以上半角英数字'), {
      target: { value: 'Password123' },
    })

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  it('送信ボタンが読み込み中は無効になること', () => {
    render(
      <SigninForm
        register={jest.fn()}
        handleSubmit={jest.fn()}
        errors={{}}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />,
    )

    const submitButton = screen.getByRole('button', {
      name: 'ログイン',
    }) as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
  })

  it('エラーが表示されること', () => {
    const errors = {
      email: { message: 'メールアドレスは必須です', type: 'required' },
      password: { message: 'パスワードは必須です', type: 'required' },
    }

    render(
      <SigninForm
        register={jest.fn()}
        handleSubmit={jest.fn()}
        errors={errors}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />,
    )

    expect(screen.getByText('メールアドレスは必須です')).toBeInTheDocument()
    expect(screen.getByText('パスワードは必須です')).toBeInTheDocument()
  })

  it('新規登録リンクが正しく動作すること', () => {
    render(
      <SigninForm
        register={jest.fn()}
        handleSubmit={jest.fn()}
        errors={{}}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />,
    )

    const link = screen.getByText('新規登録')
    expect(link).toHaveAttribute('href', '/auth/signup')
  })
})
