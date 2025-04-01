import Image from 'next/image'
import { useState } from 'react'
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormSetValue,
} from 'react-hook-form'
import { ProfileFormValues } from '../validations/updateProfileValidation'
import { FormField } from '@/features/auth/ui/FormField'
import { FormHeading } from '@/features/auth/ui/FormHeading'
import { SubmitButton } from '@/features/auth/ui/SubmitButton'

type ProfileFormProps = {
  register: UseFormRegister<ProfileFormValues>
  handleSubmit: UseFormHandleSubmit<ProfileFormValues>
  setValue: UseFormSetValue<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  onSubmit: (data: ProfileFormValues) => void
  isLoading: boolean
  imageUrl: string
}

export const ProfileForm = ({
  register,
  handleSubmit,
  setValue,
  errors,
  onSubmit,
  isLoading,
  imageUrl,
}: ProfileFormProps) => {
  const [imagePreview, setImagePreview] = useState(imageUrl || '')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      setValue('image', file)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <FormHeading title="プロフィール" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          role="form"
        >
          <div className="flex flex-col items-center">
            <div className="relative mt-2 flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-full">
              <Image
                src={imagePreview ? imagePreview : '/images/default-avatar.png'}
                alt="Profile Preview"
                className="size-full object-cover"
                width={96}
                height={96}
                unoptimized
              />
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">
                {errors.image.message}
              </p>
            )}
          </div>
          <FormField
            label="名前"
            name="name"
            type="text"
            register={register}
            errors={errors}
          />
          <FormField
            label="ニックネーム"
            name="nickname"
            type="text"
            register={register}
            errors={errors}
          />
          <FormField
            label="自己紹介"
            name="bio"
            type="textarea"
            register={register}
            errors={errors}
          />
          <FormField
            label="Github"
            name="githubUrl"
            type="text"
            register={register}
            errors={errors}
          />
          <FormField
            label="Web"
            name="websiteUrl"
            type="text"
            register={register}
            errors={errors}
          />

          <SubmitButton text="更新" isLoading={isLoading} />
        </form>
      </div>
    </div>
  )
}
