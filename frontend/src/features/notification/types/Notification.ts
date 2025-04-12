export type Notification = {
  id: number
  action: 'liked' | 'followed' | 'commented' | 'published'
  read: boolean
  createdAt: string
  notifiable: {
    id: number
    type: string
    title?: string
    bugId?: number
  }
  user: {
    id: number
    name: string
    imageUrl: string | null
  }
  actor: {
    id: number
    name: string
    imageUrl: string | null
  }
}
