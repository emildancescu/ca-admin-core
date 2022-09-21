import { all, takeEvery, put, call, race, delay, take } from 'redux-saga/effects'
import { notification } from 'antd'
import _ from 'lodash'
import { api } from 'utils/net'
import actions from 'redux/user/actions'
import { requestReduxActionType } from './actions'

function showErrorNotification(content, title = 'Oops') {
  let description = 'Something went wrong, please retry.'

  if (_.isObject(content)) {
    const { errors, message } = content
    const keys = errors && Object.keys(errors)

    if (keys && keys.length > 0) {
      const {
        [keys[0]]: [firstError],
      } = errors
      description = firstError // show first error in the errors array
    } else if (message) {
      description = message
    }
  } else if (content) {
    description = content
  }

  notification.error({
    message: title,
    description,
  })
}

function request(config) {
  return function* REQUEST({ payload }) {
    const {
      url: loginUrl,
      networkSagaConfig: { timeout },
    } = config

    const { options, action, extra, networkSagaConfig } = payload

    let api_delay = timeout

    if (networkSagaConfig) {
      if (networkSagaConfig.timeout) {
        api_delay = networkSagaConfig.timeout
      }
    }

    try {
      yield put({
        type: `${action}/request`,
        payload: {
          extra,
        },
        requestPayload: payload,
      })

      const controller = new AbortController()
      const { signal } = controller

      const { response, r_timeout, r_cancel } = yield race({
        response: call(api, { ...options, signal }),
        r_timeout: delay(api_delay * 1000),
        r_cancel: take(`${action}/cancel`),
      })

      // Handle cancel
      if (r_cancel) {
        controller.abort()

        yield put({
          type: `${action}/cancelled`,
          requestPayload: payload,
        })

        return
      }

      // Handle API timeout
      if (r_timeout) {
        notification.warning({
          message: 'Slow connection',
          description: 'Request timed out. Please retry.',
        })

        yield put({
          type: `${action}/error`,
          requestPayload: payload,
        })

        return
      }

      // Get JSON data
      const data = yield call([response, response.json])

      if (response.ok) {
        yield put({
          type: `${action}/success`,
          payload: data,
          requestPayload: payload,
        })

        return
      }

      // Oops, something happened!
      yield put({
        type: `${action}/error`,
        payload: data,
        requestPayload: payload,
      })

      // Check status code
      switch (response.status) {
        case 401:
          // is this a login attempt?
          if (options.url === loginUrl) {
            showErrorNotification(data)
            break
          }

          // user not authorized, redirect to login
          yield put({
            type: actions.LOGOUT,
            requestPayload: payload,
          })
          break

        case 429:
          showErrorNotification('Too many attempts.')
          break

        default:
          showErrorNotification(data)
          break
      }
    } catch (e) {
      if (e.message === 'Failed to fetch') {
        showErrorNotification('Check your internet connection.', 'Offline')
      } else {
        showErrorNotification()
      }

      yield put({
        type: `${action}/error`,
        requestPayload: payload,
      })
    }
  }
}

export default function* rootSaga(config) {
  yield all([takeEvery(requestReduxActionType, request(config))])
}
