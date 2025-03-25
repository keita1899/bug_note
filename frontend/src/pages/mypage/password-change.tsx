import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { MypageLayout } from '@/components/MypageLayout'
import { PasswordChangeForm } from '@/features/mypage/components/PasswordChangeForm'
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from '@/features/mypage/validations/changePasswordValidation'
import { useRequiredSignedIn } from '@/hooks/useRequiredSignedIn'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

const PasswordChange = () => {
  useRequiredSignedIn()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  const changePassword = async (data: ChangePasswordFormValues) => {
    const response = await axios.patch(API_URLS.AUTH.PASSWORD, data, {
      headers: getAuthHeaders() ?? {},
    })
    return response
  }

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      toast.success(response.data.message)
      router.push('/mypage')
    },
    onError: (error: AxiosError<{ errors: string[] }>) => {
      console.log(error)
      const errorMessage =
        error.response?.data?.errors[0] || '予期しないエラーが発生しました'
      toast.error(errorMessage)
    },
  })

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = (
    data: ChangePasswordFormValues,
  ) => {
    changePasswordMutation.mutate(data)
  }

  return (
    <MypageLayout>
      <PasswordChangeForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        isLoading={changePasswordMutation.isPending}
      />
    </MypageLayout>
  )
}

export default PasswordChange
