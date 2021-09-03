import { all, takeEvery, put, select } from 'redux-saga/effects'
import { notification } from 'antd'
import store from 'store'
import _ from 'lodash'
import { login as apiLogin } from 'services/api'
import request from 'redux/network/actions'
import actions from './actions'

const getUser = state => state.user

function login(url, extraParams) {
  return function* LOGIN({ payload }) {
    yield put(request(apiLogin(url, { ...payload, ...extraParams }), 'auth'))
  }
}

function* LOGOUT() {
  yield store.remove('app.user')
  yield put({
    type: 'auth/reset',
  })
}

function success(adminRoles) {
  return function* SUCCESS() {
    const user = yield select(getUser)

    // check if user has any other role besides "client"
    if (user && user.roles && _.intersection(user.roles, adminRoles).length === 0) {
      // and force logout if not
      yield LOGOUT()
    } else {
      // persist user data
      yield store.set('app.user', user)

      notification.success({
        message: 'Logged in',
        description: 'You have successfully logged in!',
      })
    }
  }
}

export default function* rootSaga(config) {
  const { url, adminRoles, extraParams = {} } = config

  yield all([
    takeEvery(actions.LOGIN, login(url, extraParams)),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.SUCCESS, success(adminRoles)),
  ])
}
