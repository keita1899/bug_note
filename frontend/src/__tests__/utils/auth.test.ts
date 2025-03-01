import { saveAuthTokens } from '@/utils/auth'

describe('saveAuthTokens', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('正しく localStorage に保存されること', () => {
    const accessToken = 'test-access-token'
    const client = 'test-client'
    const uid = 'test-uid'

    saveAuthTokens(accessToken, client, uid)

    expect(localStorage.getItem('access-token')).toBe(accessToken)
    expect(localStorage.getItem('client')).toBe(client)
    expect(localStorage.getItem('uid')).toBe(uid)
  })
})
