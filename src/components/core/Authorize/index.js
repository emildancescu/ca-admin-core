import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Icon, notification, Popover, Tag } from 'antd'

import { checkAccess } from 'utils/auth'

import './style.css'

const isDebug = process.env.REACT_APP_PERMISSIONS_DEBUG === 'true'

const DebugContainer = props => {
  const { isAuthorized, permissions, roles, children } = props

  const color = isAuthorized ? 'green' : 'red'

  const style = {
    display: 'inherit',
    position: 'relative',
    boxShadow: `0px 0px 0px 1px ${color} inset`,
    padding: 5,
    borderRadius: 5,
  }

  const lockStyle = {
    color,
  }

  const content = (
    <>
      {roles && (
        <div>
          <b>Roles:</b>{' '}
          {roles.map(role => (
            <Tag key={role} className="mb-1">
              {role}
            </Tag>
          ))}
        </div>
      )}
      {permissions && (
        <div>
          <b>Permissions:</b>{' '}
          {permissions.map(perm => (
            <Tag key={perm} className="mb-1">
              {perm}
            </Tag>
          ))}
        </div>
      )}
    </>
  )

  const title = (
    <span style={{ color, fontWeight: 'bold' }}>
      {isAuthorized ? 'Authorized' : 'Not authorized'}
    </span>
  )

  return (
    <div style={style}>
      <Popover title={title} content={content}>
        <div style={lockStyle} className="auth-lock">
          <Icon type="lock" />
        </div>
      </Popover>

      {children}
    </div>
  )
}

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
      if (!authorized && !isDebug) {
        return null
      }

      if (!authorized && isDebug) {
        return (
          <DebugContainer isAuthorized={false} permissions={permissions} roles={roles}>
            {children}
          </DebugContainer>
        )
      }

      if (isDebug) {
        return (
          <DebugContainer isAuthorized permissions={permissions} roles={roles}>
            {children}
          </DebugContainer>
        )
      }

      // if access is successful render children
      return <>{children}</>
    }

    return AuthorizedChildren()
  }
}

export default Authorize
