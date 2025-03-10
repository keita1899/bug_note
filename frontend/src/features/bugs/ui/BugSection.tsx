import { ReactNode } from 'react'

type BugSectionProps = {
  title: string
  content?: string
  children?: ReactNode
}

export const BugSection = ({ title, content, children }: BugSectionProps) => {
  return (
    <div>
      <h3 className="border-b border-gray-300 pb-1 font-semibold">{title}</h3>
      {children ? (
        <div className="py-4">{children}</div>
      ) : (
        content && <p className="mt-1">{content}</p>
      )}
    </div>
  )
}
