import { FieldError } from 'react-hook-form'

type FormFieldProps = {
  label: string
  name: string
  error?: FieldError
  required?: boolean
  children: React.ReactNode
}

export const FormField = ({
  label,
  name,
  error,
  required = false,
  children,
}: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="font-bold">
        {label}
        {required && <span className="ml-2 text-sm text-red-500">必須</span>}
      </label>
      {children}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}
