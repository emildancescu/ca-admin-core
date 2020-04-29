import React, { Component } from 'react'
import { Admin, Loadable } from 'lib'
// import { API } from 'utils/constants'

const routes = [
  // Dashboard
  {
    path: '/dashboard',
    component: Loadable(() => import('pages/dashboard')),
    exact: true,
  },
]

const menu = {
  left: [
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'icmn icmn-home',
    },
  ],
  top: [],
}

// const authConfig = {
//   url: API.LOGIN,
//   adminRoles: [ 'admin' ],
//   transformPayload: payload => ({
//     id: payload.user.id,
//     name: payload.user.first_name,
//     roles: payload.roles.map(role => role.name),
//     token: payload.accessToken,
//     email: payload.user.email,
//   }),
// }

export default class App extends Component {
  render() {
    return <Admin title="CA Admin Core" routes={routes} menu={menu} />
  }
}
