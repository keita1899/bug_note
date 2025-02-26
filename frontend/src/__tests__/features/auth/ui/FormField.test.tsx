import { render, screen, fireEvent } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { FormField } from '@/features/auth/ui/FormField'
import { FormValues } from '@/features/auth/validations/signupValidation'

const mockRegister = jest.fn()

const mockErrors = {
  email: {
    message: 'メールアドレスは必須です',
    type: 'required',
  },
}

describe('FormField Component', () => {
  const FormComponent = () => {
    const {
      register = mockRegister,
      handleSubmit,
      formState: { errors = mockErrors },
    } = useForm<FormValues>()

    const onSubmit = (data: FormValues) => console.log(data)

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Email"
          name="email"
          type="email"
          register={register}
          errors={errors}
          placeholder="Enter your email"
        />
      </form>
    )
  }

  it('入力フィールドが正しいラベルとプレースホルダでレンダリングされること', () => {
    render(<FormComponent />)

    const input = screen.getByPlaceholderText('Enter your email')
    expect(input).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('入力が有効な場合にエラーメッセージが表示されないこと', async () => {
    render(<FormComponent />)

    const input = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(input, { target: { value: 'test@example.com' } })

    expect(
      screen.queryByText('メールアドレスは必須です'),
    ).not.toBeInTheDocument()
  })
})
