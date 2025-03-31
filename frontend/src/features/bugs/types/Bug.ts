import { Attempt } from './Attempt'
import { Environment } from './Environment'
import { Reference } from './Reference'
import { Comment } from '@/features/comment/types/Comment'

export type Bug = {
  id: string
  title: string
  content: string
  errorMessage: string
  environments: Environment[]
  attempts: Attempt[]
  expectedBehavior: string
  cause: string
  solution: string
  references: Reference[]
  etc: string
  status: 'draft' | 'published'
  isSolved: boolean
  isLiked: boolean
  likeCount: number
  createdAt: string
  fromToday: string
  user: {
    id: number
    imageUrl: string
    name: string
    nickname: string
  }
  comments: Comment[]
}
