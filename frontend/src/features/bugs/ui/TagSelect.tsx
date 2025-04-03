import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { BugFormValues } from '../validations/saveBugValidations'
import { TagInput } from './TagInput'
import { TagList } from './TagList'
import { Tag } from '@/features/bugs/types/Tag'

type TagSelectProps = {
  tags: Tag[]
  setValue: UseFormSetValue<BugFormValues>
  watch: UseFormWatch<BugFormValues>
  error?: string
}

export const TagSelect = ({ tags, setValue, watch, error }: TagSelectProps) => {
  const selectedTagIds = watch('tags') || []

  const handleSelectTag = (tag: Tag) => {
    if (selectedTagIds.length >= 3) {
      return
    }
    const newTags = [...selectedTagIds, tag.id]
    setValue('tags', newTags, { shouldValidate: true })
  }

  const handleRemoveTag = (tagId: number) => {
    const newTags = selectedTagIds.filter((id) => id !== tagId)
    setValue('tags', newTags, { shouldValidate: true })
  }

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id))

  return (
    <div className="space-y-4">
      <TagInput
        tags={tags}
        setValue={setValue}
        watch={watch}
        error={error}
        onSelectTag={handleSelectTag}
      />
      {selectedTags.length > 0 && (
        <TagList
          tags={[...selectedTags].reverse()}
          onRemoveTag={handleRemoveTag}
          showDeleteButton={true}
        />
      )}
    </div>
  )
}
