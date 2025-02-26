import Link from 'next/link'
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form'
import { FormField } from '../ui/FormField'
import { FormHeading } from '../ui/FormHeading'
import { SubmitButton } from '../ui/SubmitButton'
import { FormValues } from '../validations/signupValidation'

type SignupFormProps = {
  register: UseFormRegister<FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues>
  errors: FieldErrors<FormValues>
  onSubmit: (data: FormValues) => void
  isLoading: boolean
}

export const SignupForm = ({
  register,
  handleSubmit,
  errors,
  onSubmit,
  isLoading,
}: SignupFormProps) => {
  return (
    <div className="mt-10 flex justify-center">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <FormHeading
          title="新規登録"
          description="アカウントを作成すると、確認メールが送信されます。メールに記載されたリンクをクリックして、アカウントを有効化してください。"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          role="form"
        >
          <FormField
            label="メールアドレス"
            name="email"
            type="email"
            register={register}
            errors={errors}
            placeholder="email@example.com"
          />
          <FormField
            label="パスワード"
            name="password"
            type="password"
            register={register}
            errors={errors}
            placeholder="8文字以上半角英数字"
          />
          <FormField
            label="パスワード確認"
            name="confirmPassword"
            type="password"
            register={register}
            errors={errors}
            placeholder="確認用パスワード"
          />
          <SubmitButton text="登録" isLoading={isLoading} />
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm">
            既にアカウントをお持ちですか?{' '}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
