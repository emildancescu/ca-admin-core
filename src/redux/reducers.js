import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'

export default (history, reducers = {}) =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    ...reducers,
  })
