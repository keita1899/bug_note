export type Comment = {
  id: string
  bugId: string
  content: string
  createdAt: string
  user: {
    id: number
    imageUrl: string
    nickname: string
  }
}
