import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Path,
  useWatch,
} from 'react-hook-form'
import { toast } from 'react-toastify'
import { Layout } from '@/components/Layout'
import { Category } from '@/features/bugs/types/Category'
import { Tag } from '@/features/bugs/types/Tag'
import { CancelButton } from '@/features/bugs/ui/CancelButton'
import { DynamicFormField } from '@/features/bugs/ui/DynamicFormField'
import { FormField } from '@/features/bugs/ui/FormField'
import { Input } from '@/features/bugs/ui/Input'
import { SubmitButton } from '@/features/bugs/ui/SubmitButton'
import { TagSelect } from '@/features/bugs/ui/TagSelect'
import { Textarea } from '@/features/bugs/ui/Textarea'
import {
  BugFormValues,
  bugSchema,
} from '@/features/bugs/validations/saveBugValidations'
import { useRequiredSignedIn } from '@/hooks/useRequiredSignedIn'
import { fetcher } from '@/utils'
import { API_URLS } from '@/utils/api'
import { getAuthHeaders } from '@/utils/headers'

export default function BugFormContainer() {
  useRequiredSignedIn()
  const router = useRouter()

  const { data: tags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => fetcher(API_URLS.TAGS),
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BugFormValues>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      title: '',
      error_message: '',
      content: '',
      expected_behavior: '',
      solution: '',
      cause: '',
      etc: '',
      environments: [{ category: '', name: '', version: '' }],
      attempts: [{ content: '' }],
      references: [{ url: '' }],
      is_solved: false,
      status: 'draft',
      tags: [],
    },
  })

  const [environments, attempts, references, status, is_solved] = useWatch({
    control,
    name: ['environments', 'attempts', 'references', 'status', 'is_solved'],
  })

  const {
    fields: envFields,
    append: addEnv,
    remove: removeEnv,
  } = useFieldArray({ control, name: 'environments' })

  const {
    fields: attemptFields,
    append: addAttempt,
    remove: removeAttempt,
  } = useFieldArray({ control, name: 'attempts' })

  const {
    fields: referenceFields,
    append: addRef,
    remove: removeRef,
  } = useFieldArray({
    control,
    name: 'references',
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetcher(API_URLS.CATEGORIES),
  })

  const handleChangeCategory = (index: number, value: string) => {
    setValue(`environments.${index}.category`, value)
  }

  const mutation = useMutation({
    mutationFn: async (data: BugFormValues) => {
      try {
        const res = await axios.post(API_URLS.BUG.CREATE, data, {
          headers: getAuthHeaders() ?? {},
        })
        return res.data
      } catch (error) {
        throw new Error('保存に失敗しました')
      }
    },
    onSuccess: (data) => {
      toast.success(data.message)
      router.push('/')
    },
    onError: () => toast.error('保存に失敗しました'),
  })

  const onSubmit: SubmitHandler<BugFormValues> = (data: BugFormValues) => {
    mutation.mutate(data)
  }

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-12 w-full max-w-full space-y-8 p-4 md:max-w-4xl lg:max-w-3xl"
      >
        <div className="flex flex-row-reverse items-end gap-2">
          <div className="flex flex-col items-center">
            <input
              type="checkbox"
              checked={status === 'published'}
              onChange={() =>
                setValue('status', status === 'draft' ? 'published' : 'draft')
              }
              className="toggle toggle-lg"
            />
            <span className="mt-1 text-sm">
              {status === 'published' ? '公開' : '下書き'}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="checkbox"
              checked={is_solved}
              onChange={() => setValue('is_solved', !is_solved)}
              className="toggle toggle-lg"
            />
            <span className="mt-1 text-sm">
              {is_solved ? '解決済' : '未解決'}
            </span>
          </div>
        </div>

        {(errors.is_solved || errors.status) && (
          <div className="rounded bg-red-100 p-2 text-red-700">
            {errors.is_solved && <p>{errors.is_solved.message}</p>}
            {errors.status && <p>{errors.status.message}</p>}
          </div>
        )}

        <FormField label="タイトル" name="title" error={errors.title} required>
          <Input name="title" register={register} />
        </FormField>

        {tags && (
          <TagSelect
            tags={tags}
            setValue={setValue}
            watch={watch}
            error={errors.tags?.message}
          />
        )}

        <FormField
          label="エラーメッセージ"
          name="error_message"
          error={errors.error_message}
        >
          <Textarea name="error_message" register={register} />
        </FormField>

        <FormField
          label="エラー内容"
          name="content"
          error={errors.content}
          required
        >
          <Textarea name="content" register={register} />
        </FormField>

        <DynamicFormField
          fields={envFields}
          renderInput={(index) => (
            <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3">
              <select
                className="select select-bordered"
                value={environments[index]?.category || ''}
                onChange={(e) => handleChangeCategory(index, e.target.value)}
              >
                <option value="">カテゴリーを選択</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Input
                name={`environments[${index}].name` as Path<BugFormValues>}
                register={register}
                error={errors.environments?.[index]?.name?.message}
              />
              <Input
                name={`environments[${index}].version` as Path<BugFormValues>}
                register={register}
                error={errors.environments?.[index]?.version?.message}
              />
            </div>
          )}
          addItem={() => addEnv({ category: '', name: '', version: '' })}
          removeItem={removeEnv}
          title="環境"
          isFieldEmpty={environments.some(
            (env) => !env.category && !env.name && !env.version,
          )}
        />

        <FormField
          label="期待する動作"
          name="expected_behavior"
          error={errors.expected_behavior}
        >
          <Textarea name="expected_behavior" register={register} />
        </FormField>

        <DynamicFormField
          fields={attemptFields}
          renderInput={(index) => (
            <Textarea
              name={`attempts[${index}].content` as Path<BugFormValues>}
              register={register}
              error={errors.attempts?.[index]?.content?.message}
            />
          )}
          addItem={() => addAttempt({ content: '' })}
          removeItem={removeAttempt}
          title="試したこと"
          isFieldEmpty={attempts.some((attempt) => !attempt.content)}
        />

        <FormField label="解決方法" name="solution" error={errors.solution}>
          <Textarea name="solution" register={register} />
        </FormField>

        <FormField label="原因" name="cause" error={errors.cause}>
          <Textarea name="cause" register={register} />
        </FormField>

        <DynamicFormField
          fields={referenceFields}
          renderInput={(index) => (
            <Input
              name={`references[${index}].url` as Path<BugFormValues>}
              register={register}
              error={errors.references?.[index]?.url?.message}
            />
          )}
          addItem={() => addRef({ url: '' })}
          removeItem={removeRef}
          title="参考リンク"
          isFieldEmpty={references.some((reference) => !reference.url)}
        />

        <FormField label="その他" name="etc" error={errors.etc}>
          <Textarea name="etc" register={register} />
        </FormField>

        <div className="flex w-full justify-end gap-4">
          <CancelButton />
          <SubmitButton isLoading={mutation.isPending} />
        </div>
      </form>
    </Layout>
  )
}
