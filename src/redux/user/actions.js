import { networkActions } from 'redux/network/actions'

const actions = {
  LOGIN: 'user/LOGIN',
  LOGOUT: 'user/LOGOUT',
  ...networkActions('auth'),
}

export default actions
