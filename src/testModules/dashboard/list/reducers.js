import actions from './actions'

const initialState = {
  loading: false,
  data: null,
  pagination: null,
}

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.REQUEST:
      return {
        ...state,
        loading: true,
      }
    case actions.SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        pagination: action.payload.pagination,
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
    default:
      return state
  }
}
