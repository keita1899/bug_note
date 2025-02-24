type ErrorProps = {
  message?: string
}

export const ErrorMessage = ({ message }: ErrorProps) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="alert alert-error max-w-md p-6 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6 shrink-0 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 18.364A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01"
          />
        </svg>
        <div>
          <h2 className="font-bold text-white">エラーが発生しました</h2>
          <p className="text-white">
            {message ||
              '現在、システムに技術的な問題が発生しています。ご不便をおかけして申し訳ありませんが、復旧までしばらくお待ちください。'}
          </p>
        </div>
      </div>
    </div>
  )
}
