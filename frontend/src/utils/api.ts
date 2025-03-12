export const API_URLS = {
  AUTH: {
    SIGNUP: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    SIGNIN: `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_in`,
    CONFIRMATION: `${process.env.NEXT_PUBLIC_API_URL}/user/confirmations`,
    CURRENT_USER: `${process.env.NEXT_PUBLIC_API_URL}/current/user`,
  },
  BUG: {
    INDEX: `${process.env.NEXT_PUBLIC_API_URL}/bugs`,
    SHOW: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/bugs/${id}`,
    CREATE: `${process.env.NEXT_PUBLIC_API_URL}/bugs`,
    UPDATE: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/bugs/${id}`,
    DELETE: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/bugs/${id}`,
  },
  CATEGORIES: `${process.env.NEXT_PUBLIC_API_URL}/categories`,
}
