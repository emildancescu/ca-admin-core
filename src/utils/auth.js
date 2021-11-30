import store from 'store'
import _ from 'lodash'

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

export function checkAccess(required = [], granted = []) {
  return _.intersection(required, granted).length > 0 || required.length === 0
}
