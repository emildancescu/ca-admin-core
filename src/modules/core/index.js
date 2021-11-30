import { API, ADMIN_ROLES } from 'utils/constants'

import user from 'redux/user/reducers'
import userSaga from 'redux/user/sagas'

import networkSaga from 'redux/network/sagas'

const defaultAuthConfig = {
  url: API.LOGIN,
  adminRoles: ADMIN_ROLES,
  extraParams: {},
  transformPayload: payload => {
    if (!payload) return {}

    let transformedPayload = {
      token: payload.accessToken,
    }

    if (payload.user) {
      transformedPayload = {
        ...transformedPayload,
        id: payload.user.id,
        name: payload.user.first_name,
        email: payload.user.email,
      }
    }

    if (payload.roles) {
      transformedPayload = {
        ...transformedPayload,
        roles: payload.roles.map(role => role.name),
      }
    }

    if (payload.permissions) {
      transformedPayload = {
        ...transformedPayload,
        permissions: payload.permissions.map(permission => permission.name),
      }
    }

    return transformedPayload
  },
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
