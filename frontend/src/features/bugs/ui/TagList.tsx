import { Tag } from '@/features/bugs/types/Tag'

type TagListProps = {
  tags: Tag[]
  onRemoveTag?: (tagId: number) => void
  showDeleteButton?: boolean
}

export const TagList = ({
  tags,
  onRemoveTag,
  showDeleteButton = false,
}: TagListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="group inline-flex items-center gap-1 rounded-md bg-gray-400 px-3 py-1 text-sm text-white"
        >
          # {tag.name}
          {showDeleteButton && onRemoveTag && (
            <button
              type="button"
              className="btn btn-ghost btn-xs invisible size-5 rounded-full p-0 hover:text-white group-hover:visible"
              onClick={() => onRemoveTag(tag.id)}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
