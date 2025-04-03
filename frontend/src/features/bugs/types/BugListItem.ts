import { Tag } from './Tag'

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
    imageUrl: string
    name: string
  }
  tags: Tag[]
}
