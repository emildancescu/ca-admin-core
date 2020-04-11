import { all, takeEvery, put, select } from 'redux-saga/effects'
import { notification } from 'antd'
import store from 'store'
import _ from 'lodash'
import { ADMIN_ROLES } from 'utils/constants'
import { login } from 'services/api'
import request from 'redux/network/actions'
import actions from './actions'

const getUser = state => state.user

function* LOGIN({ payload }) {
  const { email, password } = payload
  yield put(request(login(email, password), 'auth'))
}

function* LOGOUT() {
  yield store.remove('app.user')
  yield put({
    type: 'auth/reset',
  })
}

function* SUCCESS() {
  const user = yield select(getUser)

  // check if user has any other role besides "client"
  if (user && user.roles && _.intersection(user.roles, ADMIN_ROLES).length === 0) {
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.SUCCESS, SUCCESS),
  ])
}
