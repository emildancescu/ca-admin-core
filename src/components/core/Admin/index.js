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
import defaultModules from 'modules'
import defaultRoutes from 'services/routes'
import initReducers from 'redux/reducers'
import initSagas from 'redux/sagas'

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

const processModules = (modules = []) => {
  modules = [...defaultModules, ...modules]

  // ensure module uniqueness and correct ordering
  const processedModules = new Map()

  modules.forEach(module => {
    processedModules.set(module.name, module)
  })

  return Array.from(processedModules.values())
}

const createAdminStore = modules => {
  let reducers = {}
  let sagas = []

  modules.forEach(module => {
    if (module.reducers) {
      reducers = {
        ...reducers,
        ...module.reducers,
      }
    }

    if (module.sagas) {
      sagas = [...sagas, ...module.sagas]
    }
  })

  const store = createStore(
    initReducers({ history }, reducers),
    compose(applyMiddleware(...middlewares)),
  )
  sagaMiddleware.run(initSagas({}, sagas))

  return store
}

const getRoutes = modules => {
  let routes = [...defaultRoutes]

  modules.forEach(module => {
    if (module.routes) {
      routes = [...routes, ...module.routes]
    }
  })

  return routes
}

const getMenu = modules => {
  let left = []

  modules.forEach(module => {
    if (module.menu) {
      left = [...left, ...module.menu]
    }
  })

  return {
    left,
    top: [],
  }
}

const getLocales = modules => {
  const locales = []

  modules.forEach(module => {
    if (module.locales) {
      locales.push(module.locales)
    }
  })

  return locales
}

export const AdminContext = React.createContext({})

export default class Admin extends Component {
  constructor(props) {
    super(props)

    const { modules } = this.props

    this.modules = processModules(modules)
  }

  render() {
    const { title } = this.props

    return (
      <Provider store={createAdminStore(this.modules)}>
        <AdminContext.Provider value={this.props}>
          <Localization locales={getLocales(this.modules)}>
            <Router
              history={history}
              routes={getRoutes(this.modules)}
              menu={getMenu(this.modules)}
              title={title}
            />
          </Localization>
        </AdminContext.Provider>
      </Provider>
    )
  }
}
