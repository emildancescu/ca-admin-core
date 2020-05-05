import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import menu from './menu/reducers'
import settings from './settings/reducers'

export default (config, reducers = {}) =>
  combineReducers({
    router: connectRouter(config.history),
    menu,
    settings,
    ...reducers,
  })
