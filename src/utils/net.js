import store from 'store'

function toQueryString(params, nesting = '') {
  return Object.entries(params)
    .map(([k, v]) => {
      k = encodeURIComponent(k)

      // check if there are nested objects and not null
      if (typeof v === 'object' && v !== null) {
        return toQueryString(v, nesting ? `${nesting}[${k}]` : `${k}`)
      }

      v = encodeURIComponent(v)

      return nesting ? `${nesting}[${k}]=${v}` : `${k}=${v}`
    })
    .filter(el => el !== '')
    .join('&')
}

export function api(options) {
  const { params, method = 'GET', token = '', signal } = options
  let { url, headers } = options

  const lang = store.get('app.settings.locale') || 'en'

  headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Accept-Language': lang,
    ...headers,
  }

  let newOptions = {
    headers,
    method,
    signal,
  }

  if (method === 'POST' || method === 'PUT') {
    newOptions = {
      ...newOptions,
      body: JSON.stringify(params),
    }
  } else if (method === 'GET' && params) {
    // if params are sent as an object, try to serialize and then append to the provided url
    const qs = toQueryString(params)

    if (qs) {
      url += url.indexOf('?') === -1 ? '?' : '&'
      url += qs
    }
  }

  return (
    fetch(url, newOptions)
      // .then((r) => console.log('fetch r', r))

      // Abort controller from network saga will internally throw a DOMException
      // We should catch it just in case
      .catch(e => console.log('fetch error', e))
  )
}

export function postJson(url, params, token, headers) {
  return {
    url,
    method: 'POST',
    params,
    token,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  }
}

export function putJson(url, params, token, headers) {
  return {
    url,
    method: 'PUT',
    params,
    token,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  }
}

export function get(url, params, token, headers) {
  return {
    url,
    method: 'GET',
    params,
    token,
    headers,
  }
}

export function destroy(url, params, token, headers) {
  return {
    url,
    method: 'DELETE',
    params,
    token,
    headers,
  }
}

export default {
  api,
  postJson,
  putJson,
  get,
  destroy,
}
