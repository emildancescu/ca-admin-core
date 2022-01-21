const actions = {
  REQUEST: 'rsintl/request',
  SUCCESS: 'rsintl/success',
}

const request = payload => {
  return {
    type: actions.REQUEST,
    payload,
  }
}

const success = payload => {
  return {
    type: actions.SUCCESS,
    payload,
  }
}

export { actions, request, success }
