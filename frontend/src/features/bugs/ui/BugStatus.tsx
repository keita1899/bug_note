import {
  AiOutlineWarning,
  AiOutlineCheckCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai'

type BugStatusProps = {
  isSolved: boolean
  status: 'draft' | 'published'
}

export const BugStatus = ({ isSolved, status }: BugStatusProps) => {
  return (
    <div className="mb-4 flex justify-end gap-2">
      <span
        className={`flex w-[90px] items-center rounded-full px-2 py-1 text-white ${
          isSolved ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {isSolved ? (
          <AiOutlineCheckCircle className="mr-2 inline-block" />
        ) : (
          <AiOutlineWarning className="mr-2 inline-block" />
        )}
        {isSolved ? '解決済' : '未解決'}
      </span>
      <span
        className={`flex w-[90px] items-center rounded-full px-2 py-1 text-white ${
          status === 'published' ? 'bg-blue-500' : 'bg-gray-500'
        }`}
      >
        {status === 'published' ? (
          <AiOutlineEye className="mr-2 inline-block" />
        ) : (
          <AiOutlineEyeInvisible className="mr-2 inline-block" />
        )}
        {status === 'published' ? '公開' : '下書き'}
      </span>
    </div>
  )
}
