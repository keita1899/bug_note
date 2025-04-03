import { useState, useRef, useEffect } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { BugFormValues } from '../validations/saveBugValidations'
import { Tag } from '@/features/bugs/types/Tag'

type TagInputProps = {
  tags: Tag[]
  setValue: UseFormSetValue<BugFormValues>
  watch: UseFormWatch<BugFormValues>
  error?: string
  onSelectTag: (tag: Tag) => void
}

export const TagInput = ({
  tags,
  watch,
  error,
  onSelectTag,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const selectedTagIds = watch('tags') || []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.trim()) {
      const filtered = tags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTagIds.includes(tag.id),
      )
      const exactMatches = filtered.filter((tag) =>
        tag.name.toLowerCase().startsWith(value.toLowerCase()),
      )
      const partialMatches = filtered.filter(
        (tag) => !tag.name.toLowerCase().startsWith(value.toLowerCase()),
      )
      const newSuggestions = [...exactMatches, ...partialMatches]
      setSuggestions(newSuggestions)
      setSelectedIndex(newSuggestions.length > 0 ? 0 : -1)
    } else {
      setSuggestions([])
      setSelectedIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        e.stopPropagation()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        e.stopPropagation()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        e.stopPropagation()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onSelectTag(suggestions[selectedIndex])
          setInputValue('')
          setSuggestions([])
          setSelectedIndex(-1)
        }
        break
      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        setSuggestions([])
        setSelectedIndex(-1)
        break
    }
  }

  const handleSelectSuggestion = (tag: Tag) => {
    onSelectTag(tag)
    setInputValue('')
    setSuggestions([])
    setSelectedIndex(-1)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="form-control">
      <label className="font-bold">タグ</label>
      <div className="relative">
        <input
          type="text"
          name="tags"
          className="input input-bordered w-full"
          placeholder="タグを3つまで選択できます"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        {suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg"
          >
            {suggestions.map((tag, index) => (
              <div
                key={tag.id}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSelectSuggestion(tag)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
}
