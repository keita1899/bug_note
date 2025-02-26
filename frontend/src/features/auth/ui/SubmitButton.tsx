type SubmitButtonProps = {
  text: string
  isLoading: boolean
}

export const SubmitButton = ({ text, isLoading }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className="btn btn-primary w-full"
      aria-label={text}
      disabled={isLoading}
    >
      {isLoading ? (
        <span
          className="loading loading-spinner loading-sm"
          role="status"
        ></span>
      ) : (
        text
      )}
    </button>
  )
}
