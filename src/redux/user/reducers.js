import store from 'store'
import actions from './actions'

const defaultUser = {
  authorized: false,
  loading: false,
  error: null,

  // mandatory props
  id: '',
  name: '',
  email: '',
  roles: [],
  permissions: [],
  systemRoles: [],
  dynamicRoles: [],
  systemPermissions: [],
  dynamicPermissions: [],
  token: null,
}

const initialState = store.get('app.user') || defaultUser

const userReducer = config => (state = initialState, action) => {
  const { transformPayload } = config
  const transformedPayload = transformPayload(action.payload)
  const { roles, permissions, ...rest } = transformedPayload

  switch (action.type) {
    case actions.REQUEST:
      return {
        ...state,
        loading: true,
      }
    case actions.SUCCESS:
      return {
        ...state,
        authorized: true,
        loading: false,
        ...transformPayload(action.payload),
        systemRoles: transformPayload(action.payload).roles,
        systemPermissions: transformPayload(action.payload).permissions,
      }
    case actions.ERROR:
      return {
        ...defaultUser,
      }
    case actions.RESET:
      return {
        ...defaultUser,
      }
    case actions.SET_SYSTEM_ROLES:
      return {
        ...state,
        systemRoles: transformPayload(action.payload).roles,
        roles: [...transformPayload(action.payload).roles, ...state.dynamicRoles],
      }
    case actions.SET_DYNAMIC_ROLES:
      return {
        ...state,
        dynamicRoles: transformPayload(action.payload).roles,
        roles: [...state.systemRoles, ...transformPayload(action.payload).roles],
      }
    case actions.SET_SYSTEM_PERMISSIONS:
      return {
        ...state,
        systemPermissions: transformPayload(action.payload).permissions,
        permissions: [...transformPayload(action.payload).permissions, ...state.dynamicPermissions],
      }
    case actions.SET_DYNAMIC_PERMISSIONS:
      return {
        ...state,
        dynamicPermissions: transformPayload(action.payload).permissions,
        permissions: [...state.systemPermissions, ...transformPayload(action.payload).permissions],
      }
    default:
      return state
  }
}

export default userReducer
