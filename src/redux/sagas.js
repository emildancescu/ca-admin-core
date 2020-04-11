import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import network from './network/sagas'

export default (sagas = []) => {
  return function* rootSaga() {
    yield all([user(), menu(), settings(), network(), ...sagas])
  }
}
