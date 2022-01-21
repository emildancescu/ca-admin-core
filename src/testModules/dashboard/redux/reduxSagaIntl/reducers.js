import { actions } from './actions'

const initialState = {
  loading: false,
  rsintl: 'initial',
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.REQUEST:
      return {
        ...state,
        loading: true,
      }
    case actions.SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    default:
      return state
  }
}
