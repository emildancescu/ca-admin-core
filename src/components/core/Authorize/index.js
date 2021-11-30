import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { notification } from 'antd'

import { checkAccess } from 'utils/auth'

@connect(({ user }) => ({ user }))
class Authorize extends React.Component {
  render() {
    const {
      user: { roles: userRoles, permissions: userPermissions },
    } = this.props // current user role
    const { children, redirect = false, to = '/404', roles, permissions } = this.props

    const authorized = checkAccess(roles, userRoles) && checkAccess(permissions, userPermissions)

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
