import { networkActions } from 'lib'

const actions = {
  ...networkActions('with_cancel'),
}

const load = payload => {
  return {
    type: actions.LOAD,
    payload,
  }
}

const reset = () => {
  return {
    type: actions.RESET,
  }
}

const cancel = () => {
  return {
    type: actions.CANCEL,
  }
}

export { actions, load, reset, cancel }
