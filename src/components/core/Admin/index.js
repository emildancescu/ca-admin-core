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

const createAdminStore = (reducers, sagas) => {
  const store = createStore(
    initReducers(history, reducers),
    compose(applyMiddleware(...middlewares)),
  )
  sagaMiddleware.run(initSagas(sagas))

  return store
}

export default class Admin extends Component {
  render() {
    const { reducers, sagas, routes = [], menu, title } = this.props

    return (
      <Provider store={createAdminStore(reducers, sagas)}>
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
