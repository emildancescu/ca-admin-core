import { core } from 'lib'

import dashboard from './dashboard'
import settings from './settings'

const authConfig = {
  overrideUi: false, // disable default login page
}

export default [core(authConfig), dashboard, settings]
