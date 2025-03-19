export const API_URLS = {
  AUTH: {
    SIGNUP: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    SIGNIN: `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_in`,
    CONFIRMATION: `${process.env.NEXT_PUBLIC_API_URL}/user/confirmations`,
    CURRENT_USER: `${process.env.NEXT_PUBLIC_API_URL}/current/user`,
  },
  USER: {
    SHOW: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    BUG: (id: string, page: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/bugs?page=${page}`,
    FOLLOW: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/follow`,
    UNFOLLOW: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/unfollow`,
  },
  BUG: {
    INDEX: (page: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}/bugs?page=${page}`,
    SHOW: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/bugs/${id}`,
    CREATE: `${process.env.NEXT_PUBLIC_API_URL}/bugs`,
    UPDATE: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/bugs/${id}`,
    DELETE: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/bugs/${id}`,
    COMMENT: {
      CREATE: (bugId: string) =>
        `${process.env.NEXT_PUBLIC_API_URL}/bugs/${bugId}/comments`,
      DELETE: (bugId: string, commnetId: string) =>
        `${process.env.NEXT_PUBLIC_API_URL}/bugs/${bugId}/comments/${commnetId}`,
    },
    LIKE: {
      CREATE: (id: string) =>
        `${process.env.NEXT_PUBLIC_API_URL}/bugs/${id}/likes`,
      DELETE: (id: string) =>
        `${process.env.NEXT_PUBLIC_API_URL}/bugs/${id}/likes`,
    },
    CATEGORIES: `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    MYPAGE: {
      BUG: (filter: string, page: number) => {
        const filterValue = filter === 'all' ? '' : filter
        return `${process.env.NEXT_PUBLIC_API_URL}/mypage/bugs${filterValue ? `/${filterValue}` : ''}?page=${page}`
      },
    },
  },
}
