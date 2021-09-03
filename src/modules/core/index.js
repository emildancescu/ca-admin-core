import { API, ADMIN_ROLES } from 'utils/constants'

import user from 'redux/user/reducers'
import userSaga from 'redux/user/sagas'

import networkSaga from 'redux/network/sagas'

const defaultAuthConfig = {
  url: API.LOGIN,
  adminRoles: ADMIN_ROLES,
  extraParams: {},
  transformPayload: payload => ({
    id: payload.user.id,
    name: payload.user.first_name,
    roles: payload.roles.map(role => role.name),
    token: payload.accessToken,
    email: payload.user.email,
  }),
}

export default (config = {}) => {
  config = {
    ...defaultAuthConfig,
    ...config,
  }

  return {
    name: 'core',
    reducers: { user: user(config) },
    sagas: [userSaga(config), networkSaga(config)],
  }
}
