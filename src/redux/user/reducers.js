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
  token: null,
}

const initialState = store.get('app.user') || defaultUser

const userReducer = config => (state = initialState, action) => {
  const { transformPayload } = config

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

export default userReducer
