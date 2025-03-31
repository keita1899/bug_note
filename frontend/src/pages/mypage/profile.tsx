import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Profile as ProfileType } from './types/Profile'
import { MypageLayout } from '@/components/MypageLayout'
import { Loading } from '@/components/utilities/Loading'
import { ProfileForm } from '@/features/mypage/components/ProfileForm'
import {
  ProfileFormValues,
  updateProfileSchema,
} from '@/features/mypage/validations/updateProfileValidation'
import { useRequiredSignedIn } from '@/hooks/useRequiredSignedIn'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

const Profile = () => {
  useRequiredSignedIn()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isPending: isProfilePending } = useQuery<ProfileType>({
    queryKey: ['profile'],
    queryFn: () => fetcher(API_URLS.MYPAGE.PROFILE.SHOW),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: '',
      nickname: '',
      bio: '',
      githubUrl: '',
      websiteUrl: '',
    },
    resolver: zodResolver(updateProfileSchema),
  })

  useEffect(() => {
    if (data) {
      const profile: ProfileFormValues = {
        name: data.name || '',
        nickname: data.nickname || '',
        bio: data.bio || '',
        githubUrl: data.githubUrl || '',
        websiteUrl: data.websiteUrl || '',
      }
      reset(profile)
    }
  }, [data, reset])

  const updateProfile = async (data: ProfileFormValues) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('nickname', data.nickname || '')
    formData.append('bio', data.bio || '')
    formData.append('github_url', data.githubUrl || '')
    formData.append('website_url', data.websiteUrl || '')

    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]')
    if (fileInput?.files?.[0]) {
      formData.append('image', fileInput.files[0])
    }

    const response = await axios.patch(
      API_URLS.MYPAGE.PROFILE.UPDATE,
      formData,
      {
        headers: {
          ...(getAuthHeaders() ?? {}),
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response
  }

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      toast.success(response.data.message)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      router.push('/mypage')
    },
    onError: (error: AxiosError<{ errors: string[] }>) => {
      console.log(error)
      const errorMessage =
        error.response?.data?.errors[0] || '予期しないエラーが発生しました'
      toast.error(errorMessage)
    },
  })

  const onSubmit: SubmitHandler<ProfileFormValues> = (
    data: ProfileFormValues,
  ) => {
    updateProfileMutation.mutate(data)
  }

  return (
    <MypageLayout>
      {isProfilePending ? (
        <Loading />
      ) : (
        <ProfileForm
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={onSubmit}
          isLoading={updateProfileMutation.isPending}
          imageUrl={data?.imageUrl ?? ''}
          setValue={setValue}
        />
      )}
    </MypageLayout>
  )
}

export default Profile
