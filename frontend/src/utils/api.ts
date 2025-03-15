export const API_URLS = {
  AUTH: {
    SIGNUP: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    SIGNIN: `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_in`,
    CONFIRMATION: `${process.env.NEXT_PUBLIC_API_URL}/user/confirmations`,
    CURRENT_USER: `${process.env.NEXT_PUBLIC_API_URL}/current/user`,
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
  },
  CATEGORIES: `${process.env.NEXT_PUBLIC_API_URL}/categories`,
  MYPAGE: {
    BUG: (filter: string, page: number) => {
      const filterValue = filter === 'all' ? '' : filter
      return `${process.env.NEXT_PUBLIC_API_URL}/mypage/bugs${filterValue ? `/${filterValue}` : ''}?page=${page}`
    },
  },
}
