import { Loadable } from 'lib'

export default {
  name: 'settings',
  menu: [
    {
      title: 'Settings',
      key: 'settings',
      url: '/settings',
      icon: 'icmn icmn-cog',
    },
  ],
  routes: [
    {
      path: '/settings',
      component: Loadable(() => import('./pages')),
      exact: true,
    },
  ],
  locales: {},
  reducers: {},
  sagas: [],
}
