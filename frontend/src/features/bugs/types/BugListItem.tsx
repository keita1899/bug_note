export type BugListItem = {
  id: number
  title: string
  isSolved: boolean
  status: 'draft' | 'published'
  createdAt: string
  user: {
    nickname: string
    image: string
  }
}
