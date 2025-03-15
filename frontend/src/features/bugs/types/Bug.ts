import { Attempt } from './Attempt'
import { Environment } from './Environment'
import { Reference } from './Reference'
import { Comment } from '@/features/comment/types/Comment'

export type Bug = {
  id: number
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
  createdAt: string
  fromToday: string
  user: {
    id: number
    image: string
    name: string
    nickname: string
  }
  comments: Comment[]
}
