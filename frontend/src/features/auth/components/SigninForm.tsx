import Link from 'next/link'
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form'
import { FormField } from '../ui/FormField'
import { FormHeading } from '../ui/FormHeading'
import { SubmitButton } from '../ui/SubmitButton'
import { FormValues } from '../validations/signinValidation'

type SigninFormProps = {
  register: UseFormRegister<FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues>
  errors: FieldErrors<FormValues>
  onSubmit: (data: FormValues) => void
  isLoading: boolean
}

export const SigninForm = ({
  register,
  handleSubmit,
  errors,
  onSubmit,
  isLoading,
}: SigninFormProps) => {
  return (
    <div className="mt-10 flex justify-center">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <FormHeading title="ログイン" />
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
          <SubmitButton text="ログイン" isLoading={isLoading} />
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm">
            アカウントをお持ちでないですか?{' '}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
