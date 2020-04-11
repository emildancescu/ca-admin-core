import { Loadable } from 'lib'

export default [
  // System Pages
  {
    path: '/auth/login',
    component: Loadable(() => import('pages/auth/login')),
    exact: true,
  },

  // Dashboard
  {
    path: '/dashboard',
    component: Loadable(() => import('pages/dashboard')),
    exact: true,
  },
]
