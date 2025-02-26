import { render, screen } from '@testing-library/react'
import { FormHeading } from '@/features/auth/ui/FormHeading'

describe('FormHeading Component', () => {
  it('タイトルが正しく表示されること', () => {
    render(<FormHeading title="フォームタイトル" />)

    const titleElement = screen.getByText('フォームタイトル')
    expect(titleElement).toBeInTheDocument()
  })

  it('説明文が正しく表示されること', () => {
    render(
      <FormHeading title="フォームタイトル" description="フォームの説明文" />,
    )

    const descriptionElement = screen.getByText('フォームの説明文')
    expect(descriptionElement).toBeInTheDocument()
  })

  it('説明文が指定されていない場合、表示されないこと', () => {
    render(<FormHeading title="フォームタイトル" />)

    const descriptionElement = screen.queryByText('フォームの説明文')
    expect(descriptionElement).not.toBeInTheDocument()
  })
})
