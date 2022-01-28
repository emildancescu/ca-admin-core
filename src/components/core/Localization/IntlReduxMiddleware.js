/* eslint-disable import/prefer-default-export */
import { intl } from './intlSetup'

export const IntlReduxMiddleware = () => next => action => next({ ...action, intl })
