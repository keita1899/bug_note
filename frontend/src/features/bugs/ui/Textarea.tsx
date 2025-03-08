import { Path, UseFormRegister } from 'react-hook-form'
import { BugFormValues } from '../validations/saveBugValidations'

type TextareaProps = {
  name: Path<BugFormValues>
  register: UseFormRegister<BugFormValues>
  error?: string
}

export const Textarea = ({ name, register, error }: TextareaProps) => {
  const adjustHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  return (
    <>
      <textarea
        id={name}
        {...register(name)}
        className="textarea textarea-bordered w-full"
        rows={5}
        onInput={adjustHeight}
        style={{ overflow: 'hidden' }}
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
    </>
  )
}
