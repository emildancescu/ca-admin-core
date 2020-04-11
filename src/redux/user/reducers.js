import store from 'store'
import actions from './actions'

const defaultUser = {
  id: '',
  name: '',
  email: '',
  authorized: false,
  roles: [],
  token: null,
  loading: false,
  error: null,
}

const initialState = store.get('app.user') || defaultUser

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.REQUEST:
      return {
        ...state,
        loading: true,
      }
    case actions.SUCCESS:
      return {
        ...state,
        id: action.payload.user.id,
        name: action.payload.user.first_name,
        roles: action.payload.roles.map(role => role.name),
        authorized: true,
        token: action.payload.accessToken,
        email: action.payload.user.email,
        loading: false,
      }
    case actions.ERROR:
      return {
        ...defaultUser,
      }
    case actions.RESET:
      return {
        ...defaultUser,
      }
    default:
      return state
  }
}
