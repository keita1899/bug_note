export const saveAuthTokens = (
  accessToken: string,
  client: string,
  uid: string,
) => {
  localStorage.setItem('access-token', accessToken)
  localStorage.setItem('client', client)
  localStorage.setItem('uid', uid)
}
