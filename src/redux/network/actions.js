const request = (options, action, extra) => ({
  type: 'network/request',
  payload: {
    options,
    action,
    extra,
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
  }
}
