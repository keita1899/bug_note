import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import {
  searchBugSchema,
  SearchBugFormData,
} from '../validations/searchBugValidation'

export const BugSearchForm = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchBugFormData>({
    resolver: zodResolver(searchBugSchema),
    defaultValues: {
      keyword: (router.query.keyword as string) || '',
    },
  })

  const onSubmit = (data: SearchBugFormData) => {
    const query = {
      ...router.query,
      keyword: data.keyword,
      page: 1,
    }
    router.push({
      pathname: router.pathname,
      query,
    })
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            {...register('keyword')}
            placeholder="キーワード・タグで検索"
            className="w-full rounded border p-2 pl-10 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          {errors.keyword && (
            <p className="absolute -bottom-6 left-0 text-sm text-red-500">
              {errors.keyword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-white transition-colors"
        >
          <FaSearch className="text-lg" />
        </button>
      </form>
    </div>
  )
}
