import { render, screen } from '@testing-library/react'
import EmailSent from '@/pages/auth/email-sent'

describe('EmailSent', () => {
  it('確認メッセージが表示されること', () => {
    render(<EmailSent />)

    expect(screen.getByText('確認メールを送信しました')).toBeInTheDocument()

    expect(
      screen.getByText(
        '登録が完了しました。メールボックスに届いた確認メールを開き、リンクをクリックしてアカウントを有効化してください。',
      ),
    ).toBeInTheDocument()
  })
})
