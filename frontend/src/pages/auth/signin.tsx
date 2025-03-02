import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Layout } from '@/components/Layout'
import { SigninForm } from '@/features/auth/components/SigninForm'
import {
  FormValues,
  schema,
} from '@/features/auth/validations/signinValidation'
import { useAuth } from '@/hooks/useAuth'
import { API_URLS } from '@/utils/api'
import { saveAuthTokens } from '@/utils/auth'

const Signin = () => {
  const router = useRouter()
  const { setCurrentUser, setIsAuthenticated } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const signin = async (data: FormValues) => {
    const response = await axios.post(API_URLS.AUTH.SIGNIN, data, {})
    return response
  }

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      const { 'access-token': accessToken, client, uid } = response.headers
      saveAuthTokens(accessToken, client, uid)
      setCurrentUser(response.data)
      setIsAuthenticated(true)
      toast.success('ログインしました')
      router.push('/')
    },
    onError: (error: AxiosError<{ errors: string[] }>) => {
      console.log(error)
      const errorMessage =
        error.response?.data?.errors[0] || '予期しないエラーが発生しました'
      toast.error(errorMessage)
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    mutation.mutate(data)
  }

  return (
    <Layout>
      <SigninForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        isLoading={mutation.isPending}
      />
    </Layout>
  )
}

export default Signin
