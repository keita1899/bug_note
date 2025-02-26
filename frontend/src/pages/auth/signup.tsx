import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Layout } from '@/components/Layout'
import { SignupForm } from '@/features/auth/components/SignupForm'
import {
  FormValues,
  schema,
} from '@/features/auth/validations/signupValidation'
import { API_URLS } from '@/utils/api'
import { getDefaultHeaders } from '@/utils/headers'

type ErrorMessagesResponse = {
  errors: {
    full_messages: string[]
  }
}

const Signup = () => {
  const router = useRouter()

  const signup = async (data: FormValues) => {
    const { confirmPassword, ...formData } = data
    const requestData = {
      ...formData,
      password_confirmation: confirmPassword,
    }

    await axios.post(
      API_URLS.AUTH.SIGNUP,
      {
        ...requestData,
        confirm_success_url: `${process.env.NEXT_PUBLIC_FRONT_URL}`,
      },
      { headers: getDefaultHeaders },
    )
  }

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success('登録が成功しました！確認メールを送信しました。')
      router.push('/auth/email-sent')
    },
    onError: (error: AxiosError<ErrorMessagesResponse>) => {
      const errorMessage =
        error.response?.data?.errors.full_messages?.[0] ||
        '予期しないエラーが発生しました'
      toast.error(errorMessage)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    mutation.mutate(data)
  }

  return (
    <Layout>
      <SignupForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        isLoading={mutation.isPending}
      />
    </Layout>
  )
}

export default Signup
