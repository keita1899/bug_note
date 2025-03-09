import { Attempt } from './Attempt'
import { Environment } from './Environment'
import { Reference } from './Reference'

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
  updatedAt: string
  user: {
    image: string
    name: string
    nickname: string
  }
}
