import { Loadable } from 'lib'

import en from './locales/en'
import ro from './locales/ro'

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
  ],
  locales: {
    ro,
    en,
  },
}