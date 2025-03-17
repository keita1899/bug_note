export type BugListItem = {
  id: number
  title: string
  isSolved: boolean
  status: 'draft' | 'published'
  createdAt: string
  user: {
    id: number
    nickname: string
    image: string
  }
}
