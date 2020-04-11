import actions from './actions'

const initialState = {
  menuLeftData: [],
  menuTopData: [],
  badges: {
    usersPendingActivation: 12,
  },
  counters: {},
}

export default function menuReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
