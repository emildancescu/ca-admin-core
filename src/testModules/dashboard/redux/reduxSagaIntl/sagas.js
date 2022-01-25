import { notification } from 'antd'
import { all, takeLatest, put } from 'redux-saga/effects'
import { actions, success } from './actions'

function* REQUEST(payload) {
  yield console.log('REQUEST', payload)

  yield put(success(payload.payload))
}

function* SUCCESS(payload) {
  yield console.log('SUCCESS', payload)

  yield notification.success({
    message: 'YAAAAY',
    description: payload.intl.formatMessage({ id: 'reduxSagaIntl.trigger' }),
  })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.REQUEST, REQUEST), takeLatest(actions.SUCCESS, SUCCESS)])
}
