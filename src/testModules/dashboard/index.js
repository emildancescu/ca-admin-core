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
      // roles: ['admin'],
      // permission: 'menu_dashboard'
    },
    {
      title: 'Form initialValues',
      key: 'formInitVals',
      url: '/formInitVals',
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
    {
      path: '/formInitVals',
      component: Loadable(() => import('./pages/formInitialValues')),
      exact: true,
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
