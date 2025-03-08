import { ReactNode } from 'react'
import { AddFormButton } from './AddFormButton'
import { DeleteFormButton } from './DeleteFormButton'

type DynamicFormFieldProps<T extends { id: string }> = {
  title: string
  fields: T[]
  isFieldEmpty: boolean
  renderInput: (index: number) => ReactNode
  addItem: () => void
  removeItem: (index: number) => void
}

export const DynamicFormField = <T extends { id: string }>({
  title,
  fields,
  isFieldEmpty,
  renderInput,
  addItem,
  removeItem,
}: DynamicFormFieldProps<T>) => {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 flex gap-2">
          {renderInput(index)}
          <DeleteFormButton
            onClick={() => removeItem(index)}
            disabled={fields.length === 1}
          />
        </div>
      ))}
      <div className="mt-2 flex justify-center">
        <AddFormButton onClick={addItem} disabled={isFieldEmpty} />
      </div>
    </div>
  )
}
