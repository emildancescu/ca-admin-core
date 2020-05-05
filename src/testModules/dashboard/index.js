import { Loadable } from 'lib'

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
}
