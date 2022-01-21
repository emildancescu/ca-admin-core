import { Loadable } from 'lib'

import en from './locales/en'
import ro from './locales/ro'

import users from './list/reducers'
import usersSaga from './list/sagas'

import rsintl from './redux/reduxSagaIntl/reducers'
import rsintlSaga from './redux/reduxSagaIntl/sagas'

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
      title: 'Redux Saga Intl',
      key: 'reduxSagaIntl',
      url: '/reduxSagaIntl',
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
      path: '/reduxSagaIntl',
      component: Loadable(() => import('./pages/reduxSagaIntl')),
      exact: true,
    },
  ],
  locales: {
    ro,
    en,
  },
  reducers: {
    users,
    rsintl,
  },
  sagas: [usersSaga(), rsintlSaga()],
}
