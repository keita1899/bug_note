import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form'
import { ChangePasswordFormValues } from '../validations/changePasswordValidation'
import { FormField } from '@/features/auth/ui/FormField'
import { FormHeading } from '@/features/auth/ui/FormHeading'
import { SubmitButton } from '@/features/auth/ui/SubmitButton'

type PasswordChangeFormProps = {
  register: UseFormRegister<ChangePasswordFormValues>
  handleSubmit: UseFormHandleSubmit<ChangePasswordFormValues>
  errors: FieldErrors<ChangePasswordFormValues>
  onSubmit: (data: ChangePasswordFormValues) => void
  isLoading: boolean
}

export const PasswordChangeForm = ({
  register,
  handleSubmit,
  errors,
  onSubmit,
  isLoading,
}: PasswordChangeFormProps) => {
  return (
    <div className="flex justify-center">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <FormHeading title="パスワード変更" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          role="form"
        >
          <FormField
            label="現在のパスワード"
            name="current_password"
            type="password"
            register={register}
            errors={errors}
            placeholder="8文字以上半角英数字"
          />
          <FormField
            label="新しいパスワード"
            name="password"
            type="password"
            register={register}
            errors={errors}
            placeholder="8文字以上半角英数字"
          />
          <FormField
            label="新しいパスワード確認"
            name="password_confirmation"
            type="password"
            register={register}
            errors={errors}
            placeholder="8文字以上半角英数字"
          />
          <SubmitButton text="変更" isLoading={isLoading} />
        </form>
      </div>
    </div>
  )
}
