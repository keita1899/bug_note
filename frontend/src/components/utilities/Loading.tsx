type LoadingProps = {
  message?: string
}

export const Loading = ({ message }: LoadingProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white/80 backdrop-blur-sm">
      <span className="loading loading-spinner loading-lg text-purple-500"></span>
      {message && (
        <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
      )}
    </div>
  )
}
