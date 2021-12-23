import { all, takeEvery, put, call, race, delay } from 'redux-saga/effects'
import { notification } from 'antd'
import _ from 'lodash'
import { api } from 'utils/net'
import actions from 'redux/user/actions'

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

function request(loginUrl) {
  return function* REQUEST({ payload }) {
    const { options, action, extra } = payload

    try {
      yield put({
        type: `${action}/request`,
        payload: null,
        infoSaga: {
          action,
          options,
          extra,
        },
      })

      const { response, timeout } = yield race({
        response: call(api, options),
        timeout: delay(60 * 1000),
      })

      // handle timeouts

      if (timeout) {
        notification.warning({
          message: 'Slow connection',
          description: 'Request timed out. Please retry.',
        })

        yield put({
          type: `${action}/error`,
          payload: {
            error: 'Timeout',
          },
          infoSaga: {
            action,
            options,
            extra,
          },
        })

        return
      }

      // get json data

      const data = yield call([response, response.json])

      // console.log(data)

      if (response.ok) {
        yield put({
          type: `${action}/success`,
          payload: data,
          infoSaga: {
            action,
            options,
            extra,
          },
        })

        return
      }

      // oops, something happened

      yield put({
        type: `${action}/error`,
        payload: data,
        infoSaga: {
          action,
          options,
          extra,
        },
      })

      // check status code

      switch (response.status) {
        case 401:
          // is this a login attempt?
          if (options.url === loginUrl) {
            showErrorNotification(data)
            break
          }
          console.log('401')
          // user not authorized, redirect to login
          yield put({
            type: actions.LOGOUT,
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

      // console.log(e)

      yield put({
        type: `${action}/error`,
        infoSaga: {
          action,
          options,
          extra,
        },
      })
    }
  }
}

export default function* rootSaga(config) {
  const { url } = config

  yield all([takeEvery('network/request', request(url))])
}
