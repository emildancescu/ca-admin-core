import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'

export default (config, reducers = {}) =>
  combineReducers({
    router: connectRouter(config.history),
    user: user(config.auth),
    menu,
    settings,
    ...reducers,
  })
