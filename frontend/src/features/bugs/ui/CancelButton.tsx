import { useRouter } from 'next/router'

type CancelButtonProps = {
  onClick?: () => void
}

export const CancelButton = ({ onClick }: CancelButtonProps) => {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={onClick ?? (() => router.push('/'))}
      className="btn btn-outline w-32 bg-white px-6"
    >
      キャンセル
    </button>
  )
}
