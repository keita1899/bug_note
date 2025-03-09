import { BugListItem as BugListItemType } from '../types/BugListItem'
import { BugListItem } from '../ui/BugListItem'

type BugListProps = {
  bugs: BugListItemType[]
}

export const BugList = ({ bugs }: BugListProps) => {
  return (
    <div className="space-y-4">
      {bugs?.map((bug) => <BugListItem key={bug.id} {...bug} />)}
    </div>
  )
}
