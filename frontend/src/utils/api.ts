export const API_URLS = {
  AUTH: {
    SIGNUP: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    SIGNIN: `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_in`,
    DELETE_ACCOUNT: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    CONFIRMATION: `${process.env.NEXT_PUBLIC_API_URL}/user/confirmations`,
    CURRENT_USER: `${process.env.NEXT_PUBLIC_API_URL}/current/user`,
    PASSWORD: `${process.env.NEXT_PUBLIC_API_URL}/auth/password`,
  },
  CURRENT: {
    FOLLOW: `${process.env.NEXT_PUBLIC_API_URL}/current/user/follow`,
    UNFOLLOW: `${process.env.NEXT_PUBLIC_API_URL}/current/user/unfollow`,
  },
  USER: {
    SHOW: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    BUG: (id: string, page: number) =>
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/bugs?page=${page}`,
    FOLLOWERS: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/followers`,
    FOLLOWING: (id: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/following`,
  },
  BUG: {
    INDEX: (page: number, keyword: string) =>
      `${process.env.NEXT_PUBLIC_API_URL}/bugs?page=${page}&keyword=${keyword}`,
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
  },
  CATEGORIES: `${process.env.NEXT_PUBLIC_API_URL}/categories`,
  TAGS: `${process.env.NEXT_PUBLIC_API_URL}/tags`,
  MYPAGE: {
    BUG: (filter: string, page: number) => {
      const filterValue = filter === 'all' ? '' : filter
      return `${process.env.NEXT_PUBLIC_API_URL}/mypage/bugs${filterValue ? `/${filterValue}` : ''}?page=${page}`
    },
    PROFILE: {
      SHOW: `${process.env.NEXT_PUBLIC_API_URL}/mypage/profile`,
      UPDATE: `${process.env.NEXT_PUBLIC_API_URL}/mypage/profile`,
    },
  },
}
