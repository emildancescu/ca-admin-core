import { createIntl, createIntlCache } from 'react-intl'

let cache
// eslint-disable-next-line import/no-mutable-exports
let intl

/**
 * Generate IntlShape object
 * @param {Object} props
 * @param {String} props.locale - User specified language
 * @param {Object} props.messages - Messages
 * @returns {Object}
 */
const IntlSetup = props => {
  if (cache) {
    cache = null
  }

  cache = createIntlCache()
  intl = createIntl(props, cache)

  return intl
}

export { IntlSetup, intl }
