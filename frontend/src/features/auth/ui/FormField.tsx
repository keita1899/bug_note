import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { FormValues } from '../validations/signupValidation'

type FormFieldProps = {
  label: string
  name: keyof FormValues
  type: 'text' | 'email' | 'password'
  register: UseFormRegister<FormValues>
  errors: FieldErrors<FormValues>
  placeholder: string
}

export const FormField = ({
  label,
  name,
  type,
  register,
  errors,
  placeholder,
}: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className="input input-bordered w-full"
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  )
}
