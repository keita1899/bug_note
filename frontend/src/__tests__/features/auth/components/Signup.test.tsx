import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignupForm } from '@/features/auth/components/SignupForm'

const mockOnSubmit = jest.fn()

describe('SignupForm', () => {
  it('フォームに必要なフィールドとボタンが表示されること', () => {
    render(
      <SignupForm
        register={jest.fn()}
        handleSubmit={jest.fn()}
        errors={{}}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />,
    )

    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード確認')).toBeInTheDocument()
    expect(screen.getByText('登録')).toBeInTheDocument()
  })

  it('フォームが正しく送信されること', async () => {
    const mockHandleSubmit = jest.fn().mockImplementation((fn) => fn())
    render(
      <SignupForm
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
    fireEvent.input(screen.getByPlaceholderText('確認用パスワード'), {
      target: { value: 'Password123' },
    })

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled())
  })

  it('isLoadingがtrueのとき、ボタンが無効になること', () => {
    render(
      <SignupForm
        register={jest.fn()}
        handleSubmit={jest.fn()}
        errors={{}}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />,
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('エラーがある場合、エラーメッセージが表示されること', () => {
    render(
      <SignupForm
        register={jest.fn()}
        handleSubmit={jest.fn()}
        errors={{
          email: { type: 'required', message: 'メールアドレスは必須です' },
        }}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />,
    )

    expect(screen.getByText('メールアドレスは必須です')).toBeInTheDocument()
  })
})
