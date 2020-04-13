import React, { Component } from 'react'
import { Admin, Loadable } from 'lib'

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

export default class App extends Component {
  render() {
    return <Admin title="CA Admin Core" routes={routes} menu={menu} />
  }
}
