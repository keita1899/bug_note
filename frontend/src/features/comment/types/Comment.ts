export type Comment = {
  id: string
  bugId: string
  content: string
  createdAt: string
  user: {
    id: number
    image: string
    nickname: string
  }
}
