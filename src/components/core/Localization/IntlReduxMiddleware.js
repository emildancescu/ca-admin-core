/* eslint-disable import/prefer-default-export */
import { intl } from './intlSetup'

export const IntlReduxMiddleware = () => {
  return next => action => {
    const enhancedAction = { ...action }

    if (action.type.endsWith('/success') || action.type.endsWith('/error')) {
      enhancedAction.intl = intl
    }

    const returnValue = next(enhancedAction)

    return returnValue
  }
}
