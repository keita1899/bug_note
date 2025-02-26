import { getDefaultHeaders } from '@/utils/headers'

describe('getDefaultHeaders', () => {
  it('正しいデフォルトヘッダーが返されること', () => {
    expect(getDefaultHeaders).toEqual({
      'Content-Type': 'application/json',
    })
  })
})
