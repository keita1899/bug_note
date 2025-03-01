import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form'

type FormFieldProps<T extends FieldValues> = {
  label: string
  name: Path<T>
  type: 'text' | 'email' | 'password'
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  placeholder: string
}

export const FormField = <T extends FieldValues>({
  label,
  name,
  type,
  register,
  errors,
  placeholder,
}: FormFieldProps<T>) => {
  return (
    <div>
      <label htmlFor={name as string} className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        id={name as string}
        type={type}
        {...register(name)}
        className="input input-bordered w-full"
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">
          {(errors[name] as FieldError)?.message}
        </p>
      )}
    </div>
  )
}
