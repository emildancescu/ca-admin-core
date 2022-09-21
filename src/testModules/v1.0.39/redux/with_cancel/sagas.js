import { all, takeLatest, put } from 'redux-saga/effects'
import { request } from 'lib'
import API from '../../api'
import { actions } from './actions'

const { BeeceptorDelay } = API

function* LOAD({ payload }) {
  // yield put(request(BeeceptorDelay(payload), actions.LOAD))
  yield put(
    request(BeeceptorDelay(payload), actions.LOAD, 'extraextraextra', { other: 2131, timeout: 4 }),
  )
}

export default function* saga_with_cancel() {
  yield all([takeLatest(actions.LOAD, LOAD)])
}
