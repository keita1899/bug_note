import { MdAdd } from 'react-icons/md'

type AddFormButtonProps = {
  onClick: () => void
  disabled: boolean
}

export const AddFormButton = ({ onClick, disabled }: AddFormButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-circle"
      disabled={disabled}
      aria-label="Add item"
    >
      <MdAdd className="text-blue-500" />
    </button>
  )
}
