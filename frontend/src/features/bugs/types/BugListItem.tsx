export type BugListItem = {
  id: string
  title: string
  likeCount: number
  isLiked: boolean
  isSolved: boolean
  status: 'draft' | 'published'
  createdAt: string
  user: {
    id: number
    nickname: string
    image: string
  }
}
