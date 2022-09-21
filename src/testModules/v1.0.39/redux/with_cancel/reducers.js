import { actions } from './actions'

const initialState = {
  loading: false,
  data: null,
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
        data: { ...action.payload },
        loading: false,
      }
    case actions.ERROR:
      return {
        ...initialState,
      }
    case actions.RESET:
      return {
        ...initialState,
      }
    case actions.CANCELLED:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}
