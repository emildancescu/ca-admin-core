import { Loadable } from 'components/core/Router'

export default [
  // System Pages
  {
    path: '/auth/login',
    component: Loadable(() => import('pages/auth/login')),
    exact: true,
  },
]
