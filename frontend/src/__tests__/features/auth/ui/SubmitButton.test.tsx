import { render, screen, fireEvent } from '@testing-library/react'
import { SubmitButton } from '@/features/auth/ui/SubmitButton'

describe('SubmitButton Component', () => {
  it('ボタンにテキストが正しく表示されること', () => {
    render(<SubmitButton text="送信" isLoading={false} />)

    const button = screen.getByRole('button', { name: '送信' })
    expect(button).toBeInTheDocument()
  })

  it('isLoadingがtrueのとき、ローディングスピナーが表示されること', () => {
    render(<SubmitButton text="送信" isLoading={true} />)

    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
  })

  it('isLoadingがtrueのとき、ボタンが無効になること', () => {
    render(<SubmitButton text="送信" isLoading={true} />)

    const button = screen.getByRole('button', { name: '送信' })
    expect(button).toBeDisabled()
  })

  it('isLoadingがfalseのとき、ボタンが有効になること', () => {
    render(<SubmitButton text="送信" isLoading={false} />)

    const button = screen.getByRole('button', { name: '送信' })
    expect(button).toBeEnabled()
  })

  it('ボタンがクリックされること', () => {
    const handleClick = jest.fn()
    render(<SubmitButton text="送信" isLoading={false} />)

    const button = screen.getByRole('button', { name: '送信' })
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(0)
  })
})
