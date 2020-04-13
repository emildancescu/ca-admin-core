/* eslint react/no-multi-comp: 0 */
/* eslint camelcase: 0 */

import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import ReactLoadable from 'react-loadable'

import Loader from 'components/core/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

export const Loadable = (loader, props) =>
  ReactLoadable({
    loader,
    delay: false,
    loading: () => <Loader />,
    render(loaded) {
      const Component = loaded.default
      return <Component {...props} />
    },
  })

@withRouter
class ModalSwitch extends React.Component {
  constructor(props) {
    super(props)

    const { location: previousLocation } = this.props

    this.previousLocation = previousLocation
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { location } = this.props
    const { history } = nextProps

    if (history.action !== 'POP' && (!location.state || !location.state.modal)) {
      this.previousLocation = location
    }
  }

  render() {
    const { location, routes } = this.props

    const isModal = !!(location.state && location.state.modal && this.previousLocation !== location) // not initial render

    return (
      <Switch location={isModal ? this.previousLocation : location}>
        <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
        {routes.map(route => (
          <Route
            path={route.path}
            component={!route.modal && route.component}
            key={route.path}
            exact={route.exact}
          />
        ))}
        <Route component={NotFoundPage} />
      </Switch>
    )
  }
}

class Router extends React.Component {
  render() {
    const { history, routes, menu, title } = this.props

    return (
      <ConnectedRouter history={history}>
        <IndexLayout menu={menu} title={title}>
          <ModalSwitch routes={routes} />
        </IndexLayout>

        {routes
          .filter(route => route.modal === true)
          .map(route => (
            <Route
              path={route.path}
              component={route.component}
              key={route.path}
              exact={route.exact}
            />
          ))}
      </ConnectedRouter>
    )
  }
}

export default Router
