const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

export const API_URLS = {
  AUTH: {
    SIGNUP: `${baseUrl}/auth`,
    SIGNIN: `${baseUrl}/auth/sign_in`,
    DELETE_ACCOUNT: `${baseUrl}/auth`,
    CONFIRMATION: `${baseUrl}/user/confirmations`,
    CURRENT_USER: `${baseUrl}/current/user`,
    PASSWORD: `${baseUrl}/auth/password`,
  },
  CURRENT: {
    FOLLOW: `${baseUrl}/current/user/follow`,
    UNFOLLOW: `${baseUrl}/current/user/unfollow`,
  },
  USER: {
    SHOW: (id: string) => `${baseUrl}/users/${id}`,
    BUG: (id: string, page: number) =>
      `${baseUrl}/users/${id}/bugs?page=${page}`,
    FOLLOWERS: (id: string) => `${baseUrl}/users/${id}/followers`,
    FOLLOWING: (id: string) => `${baseUrl}/users/${id}/following`,
  },
  BUG: {
    INDEX: (page: number, keyword?: string, sort?: string) => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      if (keyword) params.append('keyword', keyword)
      if (sort) params.append('sort', sort)
      return `${baseUrl}/bugs?${params.toString()}`
    },
    SHOW: (id: string) => `${baseUrl}/bugs/${id}`,
    CREATE: `${baseUrl}/bugs`,
    UPDATE: (id: string) => `${baseUrl}/bugs/${id}`,
    DELETE: (id: string) => `${baseUrl}/bugs/${id}`,
    COMMENT: {
      CREATE: (bugId: string) => `${baseUrl}/bugs/${bugId}/comments`,
      DELETE: (bugId: string, commnetId: string) =>
        `${baseUrl}/bugs/${bugId}/comments/${commnetId}`,
    },
    LIKE: {
      CREATE: (id: string) => `${baseUrl}/bugs/${id}/likes`,
      DELETE: (id: string) => `${baseUrl}/bugs/${id}/likes`,
    },
  },
  CATEGORIES: `${baseUrl}/categories`,
  TAGS: `${baseUrl}/tags`,
  MYPAGE: {
    BUG: (filter: string, page: number) => {
      const filterValue = filter === 'all' ? '' : filter
      return `${baseUrl}/mypage/bugs${filterValue ? `/${filterValue}` : ''}?page=${page}`
    },
    PROFILE: {
      SHOW: `${baseUrl}/mypage/profile`,
      UPDATE: `${baseUrl}/mypage/profile`,
    },
    NOTIFICATIONS: {
      INDEX: (page: number, tab: string) =>
        `${baseUrl}/mypage/notifications?page=${page}&tab=${tab}`,
      HEADER: `${baseUrl}/mypage/notifications/header`,
      UPDATE: (id: string) => `${baseUrl}/mypage/notifications/${id}`,
      DELETE: (id: string) => `${baseUrl}/mypage/notifications/${id}`,
    },
  },
}
