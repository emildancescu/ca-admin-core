import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { notification } from 'antd'

@connect(({ user }) => ({ user }))
class Authorize extends React.Component {
  render() {
    const {
      user: { roles: userRoles },
    } = this.props // current user role
    const { children, redirect = false, to = '/404', roles = [] } = this.props

    // intersection of roles and userRoles must have at least one element
    const authorized = roles.filter(role => userRoles.includes(role)).length > 0

    const AuthorizedChildren = () => {
      // if user not equal needed role and if component is a page - make redirect to needed route
      if (!authorized && redirect) {
        notification.error({
          message: 'Unauthorized Access',
          description: 'You have no rights to access this page!',
        })
        return <Redirect to={to} />
      }
      // if user not authorized return null to component
      if (!authorized) {
        return null
      }
      // if access is successful render children
      return <>{children}</>
    }
    return AuthorizedChildren()
  }
}

export default Authorize
