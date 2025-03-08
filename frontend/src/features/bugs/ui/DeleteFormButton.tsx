import { MdRemove } from 'react-icons/md'

type DeleteFormButtonProps = {
  onClick: () => void
  disabled: boolean
}

export const DeleteFormButton = ({
  onClick,
  disabled,
}: DeleteFormButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-circle disabled:opacity-50"
      disabled={disabled}
    >
      <MdRemove className="text-red-500" />
    </button>
  )
}
