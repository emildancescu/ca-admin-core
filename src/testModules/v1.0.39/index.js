import { Loadable } from 'lib'

import reducers from './redux/reducers'
import sagas from './redux/sagas'

export default {
  name: '1.0.39',
  menu: [
    {
      title: '1.0.39',
      key: '1.0.39',
      url: '/v1039',
      icon: 'icmn icmn-home',
    },
  ],
  routes: [
    {
      path: '/v1039',
      component: Loadable(() => import('./pages')),
      exact: true,
    },
  ],
  reducers,
  sagas,
}
