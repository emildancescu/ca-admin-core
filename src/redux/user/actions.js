import { networkActions } from 'redux/network/actions'

const actions = {
  LOGIN: 'user/LOGIN',
  LOGOUT: 'user/LOGOUT',
  ...networkActions('auth'),
  SET_SYSTEM_ROLES: 'auth/roles/system/set',
  SET_DYNAMIC_ROLES: 'auth/roles/dynamic/set',
  SET_SYSTEM_PERMISSIONS: 'auth/permissions/system/set',
  SET_DYNAMIC_PERMISSIONS: 'auth/permissions/dynamic/set',
}

export default actions

export function setSystemRoles(roles) {
  return {
    type: actions.SET_SYSTEM_ROLES,
    payload: {
      roles,
    },
  }
}

export function setDynamicRoles(roles) {
  return {
    type: actions.SET_DYNAMIC_ROLES,
    payload: {
      roles,
    },
  }
}

export function setSystemPermissions(permissions) {
  return {
    type: actions.SET_SYSTEM_PERMISSIONS,
    payload: {
      permissions,
    },
  }
}

export function setDynamicPermissions(permissions) {
  return {
    type: actions.SET_DYNAMIC_PERMISSIONS,
    payload: {
      permissions,
    },
  }
}
