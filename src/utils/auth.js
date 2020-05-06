import store from 'store'

export function getToken() {
  const user = store.get('app.user')
  return user && user.token
}

export function getBaseAuthHeaders(user, password) {
  const credentials = Buffer.from(`${user}:${password}`).toString('base64')
  return {
    Authorization: `Basic ${credentials}`,
  }
}
