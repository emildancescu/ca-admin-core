import { all, takeLatest, put } from 'redux-saga/effects'
import { request, net, getToken } from 'lib'
import actions from './actions'

const API = `https://stage.api.citylink.ro/api/v1/admin/users`
const { get } = net

const users = params => get(API, params, getToken())

function* LOAD({ payload }) {
  yield put(request(users(payload), actions.LOAD))
}

export default function* rootSaga() {
  yield all([takeLatest(actions.LOAD, LOAD)])
}
