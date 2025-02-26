type FormHeadingProps = {
  title: string
  description?: string
}

export const FormHeading = ({ title, description }: FormHeadingProps) => {
  return (
    <div className="mb-4">
      <h1 className="text-center text-2xl font-bold">{title}</h1>
      {description && (
        <p className="mt-4 text-sm text-gray-500">{description}</p>
      )}
    </div>
  )
}
