import React, { Component } from 'react'
import { logger } from 'redux-logger'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { createBrowserHistory } from 'history'
import * as serviceWorker from 'serviceWorker'

import Router from 'components/core/Router'
import Localization from 'components/core/Localization'
import initReducers from 'redux/reducers'
import initSagas from 'redux/sagas'
import defaultRoutes from 'services/routes'
import { API, ADMIN_ROLES } from 'utils/constants'

// app styles
import 'assets/styles/global.scss'

// disable cache-first approach
serviceWorker.unregister()

const history = createBrowserHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [thunk, sagaMiddleware, routeMiddleware]

// Redux Logger
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_REDUX_LOGGER === 'true') {
  middlewares.push(logger)
}

const defaultAuthConfig = {
  url: API.LOGIN,
  adminRoles: ADMIN_ROLES,
  transformPayload: payload => ({
    id: payload.user.id,
    name: payload.user.first_name,
    roles: payload.roles.map(role => role.name),
    token: payload.accessToken,
    email: payload.user.email,
  }),
}

const createAdminStore = (reducers, sagas, authConfig = {}) => {
  const auth = {
    ...defaultAuthConfig,
    ...authConfig,
  }

  const store = createStore(
    initReducers({ history, auth }, reducers),
    compose(applyMiddleware(...middlewares)),
  )
  sagaMiddleware.run(initSagas({ auth }, sagas))

  return store
}

export default class Admin extends Component {
  render() {
    const { reducers, sagas, authConfig, routes = [], menu, title } = this.props

    return (
      <Provider store={createAdminStore(reducers, sagas, authConfig)}>
        <Localization>
          <Router
            history={history}
            routes={[...defaultRoutes, ...routes]}
            menu={menu}
            title={title}
          />
        </Localization>
      </Provider>
    )
  }
}
