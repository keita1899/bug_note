import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { MypageLayout } from '@/components/MypageLayout'
import { DeleteModal } from '@/components/utilities/DeleteModal'
import { AccountDeleteForm } from '@/features/auth/components/AccountDeleteForm'
import {
  DeleteAccountFormValues,
  deleteAccountSchema,
} from '@/features/auth/validations/deleteAccountValidation'
import { useAuth } from '@/hooks/useAuth'
import { useRequiredSignedIn } from '@/hooks/useRequiredSignedIn'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

const AccountDelete = () => {
  useRequiredSignedIn()
  const router = useRouter()
  const { setCurrentUser, setIsAuthenticated } = useAuth()
  const [passwordToDelete, setPasswordToDelete] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(deleteAccountSchema),
  })

  const deleteAccount = async (data: DeleteAccountFormValues) => {
    const response = await axios.delete(API_URLS.AUTH.DELETE_ACCOUNT, {
      data: data,
      headers: getAuthHeaders() ?? {},
    })
    return response
  }

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (response) => {
      localStorage.removeItem('access-token')
      localStorage.removeItem('uid')
      localStorage.removeItem('client')
      setCurrentUser(null)
      setIsAuthenticated(false)
      toast.success(response.data.message)
      router.push('/auth/signin')
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.log(error)
      const errorMessage =
        error.response?.data?.error || '予期しないエラーが発生しました'
      toast.error(errorMessage)
    },
  })

  const onSubmit: SubmitHandler<DeleteAccountFormValues> = (
    data: DeleteAccountFormValues,
  ) => {
    setPasswordToDelete(data.password)
    setIsModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    deleteAccountMutation.mutate({ password: passwordToDelete })
    setIsModalOpen(false)
  }

  return (
    <MypageLayout>
      <AccountDeleteForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        isLoading={deleteAccountMutation.isPending}
      />
      {isModalOpen && (
        <DeleteModal
          title="本当に削除しますか？"
          description="※この操作は2度と取り消せません"
          onClose={() => setIsModalOpen(false)}
          onClick={handleDeleteConfirm}
        />
      )}
    </MypageLayout>
  )
}

export default AccountDelete
