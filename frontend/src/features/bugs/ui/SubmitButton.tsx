type SubmitButtonProps = {
  isLoading: boolean
}

export const SubmitButton = ({ isLoading }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className="btn btn-primary w-32 px-6  "
      aria-label="保存する"
      disabled={isLoading}
    >
      {isLoading ? (
        <span
          className="loading loading-spinner loading-sm"
          role="status"
        ></span>
      ) : (
        '保存'
      )}
    </button>
  )
}
