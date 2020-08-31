import { networkActions } from 'lib'

const actions = {
  ...networkActions('users'),
}

export default actions

export function load(payload) {
  return {
    type: actions.LOAD,
    payload,
  }
}
