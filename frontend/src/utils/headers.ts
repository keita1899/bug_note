export const getDefaultHeaders = {
  'Content-Type': 'application/json',
}

export const getAuthHeaders = (): Record<string, string | null> => {
  const accessToken = localStorage.getItem('access-token')
  const client = localStorage.getItem('client')
  const uid = localStorage.getItem('uid')

  return {
    'Content-Type': 'application/json',
    'access-token': accessToken,
    client,
    uid,
  }
}
