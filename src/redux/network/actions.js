export const requestReduxActionType = 'network/request'

export const request = (options, action, extra, networkSagaConfig) => ({
  type: requestReduxActionType,
  payload: {
    options,
    action,
    extra,
    networkSagaConfig,
  },
})

export default request

export function networkActions(reducer) {
  return {
    LOAD: `${reducer}`,
    REQUEST: `${reducer}/request`,
    SUCCESS: `${reducer}/success`,
    ERROR: `${reducer}/error`,
    RESET: `${reducer}/reset`,
    CANCEL: `${reducer}/cancel`,
    CANCELLED: `${reducer}/cancelled`,
  }
}

function getPrefix(prefix, type) {
  prefix = prefix.toUpperCase()
  return type ? `${prefix}_${type}` : prefix
}

export function extraNetworkActions(prefix, reducer) {
  return {
    [getPrefix(prefix)]: `${reducer}`,
    [getPrefix(prefix, 'REQUEST')]: `${reducer}/request`,
    [getPrefix(prefix, 'SUCCESS')]: `${reducer}/success`,
    [getPrefix(prefix, 'ERROR')]: `${reducer}/error`,
    [getPrefix(prefix, 'RESET')]: `${reducer}/reset`,
    [getPrefix(prefix, 'CANCEL')]: `${reducer}/cancel`,
    [getPrefix(prefix, 'CANCELLED')]: `${reducer}/cancelled`,
  }
}
