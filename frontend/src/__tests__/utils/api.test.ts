import { API_URLS } from '@/utils/api'

describe('API_URLS', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3100/api/v1'
  })

  it('should correctly construct the SIGNUP URL', () => {
    expect(API_URLS.AUTH.SIGNUP).toBe('http://localhost:3100/api/v1/auth')
  })

  it('should correctly construct the SIGNIN URL', () => {
    expect(API_URLS.AUTH.SIGNIN).toBe(
      'http://localhost:3100/api/v1/auth/signin',
    )
  })

  it('should correctly construct the CONFIRMATION URL', () => {
    expect(API_URLS.AUTH.CONFIRMATION).toBe(
      'http://localhost:3100/api/v1/user/confirmations',
    )
  })
})
