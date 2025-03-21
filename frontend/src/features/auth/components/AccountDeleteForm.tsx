import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form'
import { FormField } from '../ui/FormField'
import { FormHeading } from '../ui/FormHeading'
import { SubmitButton } from '../ui/SubmitButton'
import { DeleteAccountFormValues } from '../validations/deleteAccountValidation'

type AccountDeleteFormProps = {
  register: UseFormRegister<DeleteAccountFormValues>
  handleSubmit: UseFormHandleSubmit<DeleteAccountFormValues>
  errors: FieldErrors<DeleteAccountFormValues>
  onSubmit: (data: DeleteAccountFormValues) => void
  isLoading: boolean
}

export const AccountDeleteForm = ({
  register,
  handleSubmit,
  errors,
  onSubmit,
  isLoading,
}: AccountDeleteFormProps) => {
  return (
    <div className="mt-10 flex justify-center">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <FormHeading
          title="アカウント削除"
          description="アカウントを削除するためには、現在のパスワードを入力してください。
アカウントを削除すると、これまでのデータはすべて失われ、元に戻すことはできません。"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          role="form"
        >
          <FormField
            label="パスワード"
            name="password"
            type="password"
            register={register}
            errors={errors}
            placeholder="8文字以上半角英数字"
          />
          <SubmitButton text="送信" isLoading={isLoading} />
        </form>
      </div>
    </div>
  )
}
