type DeleteModalProps = {
  title: string
  description: string
  onClose: () => void
  onClick: () => void
}

export const DeleteModal = ({
  title,
  description,
  onClose,
  onClick,
}: DeleteModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div className="modal modal-open" onClick={(e) => e.stopPropagation()}>
        <div className="modal-box">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="btn border border-gray-300 bg-white text-black hover:bg-gray-100"
            >
              キャンセル
            </button>
            <button onClick={onClick} className="btn btn-error">
              削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
