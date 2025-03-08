import { Path, UseFormRegister } from 'react-hook-form'
import { BugFormValues } from '../validations/saveBugValidations'

type InputProps = {
  name: Path<BugFormValues>
  register: UseFormRegister<BugFormValues>
  error?: string
}

export const Input = ({ name, register, error }: InputProps) => {
  return (
    <>
      <input
        id={name}
        {...register(name)}
        className="input input-bordered w-full"
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
    </>
  )
}
