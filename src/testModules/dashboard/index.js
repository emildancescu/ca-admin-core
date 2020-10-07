import { Loadable } from 'lib'

import en from './locales/en'
import ro from './locales/ro'

import users from './list/reducers'
import usersSaga from './list/sagas'

export default {
  name: 'dashboard',
  menu: [
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'icmn icmn-home',
    },
  ],
  routes: [
    {
      path: '/dashboard',
      component: Loadable(() => import('./pages')),
      exact: true,
    },
    {
      path: '/modalJumpTab',
      component: Loadable(() => import('./pages/modalJumpTab')),
      exact: true,
      modal: true,
    },
  ],
  locales: {
    ro,
    en,
  },
  reducers: {
    users,
  },
  sagas: [usersSaga()],
}
