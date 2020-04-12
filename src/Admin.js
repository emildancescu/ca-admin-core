import React, { Component } from 'react'
import { logger } from 'redux-logger'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createBrowserHistory } from 'history'
import Router from 'router'
import Localization from 'components/LayoutComponents/Localization'
import * as serviceWorker from 'serviceWorker'
import initReducers from 'redux/reducers'
import initSagas from 'redux/sagas'

import routes from 'services/routes'

// app styles
import './global.scss'

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
    const { reducers, sagas } = this.props

    return (
      <Provider store={createAdminStore(reducers, sagas)}>
        <Localization>
          <Router history={history} routes={routes} />
        </Localization>
      </Provider>
    )
  }
}
