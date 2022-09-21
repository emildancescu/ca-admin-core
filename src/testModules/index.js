import { core } from 'lib'

import dashboard from './dashboard'
import settings from './settings'
import v1039 from './v1.0.39'

const authConfig = {
  overrideUi: false, // disable default login page
}

export default [core(authConfig), dashboard, settings, v1039]
