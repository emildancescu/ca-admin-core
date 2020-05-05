import { all } from 'redux-saga/effects'
import menu from './menu/sagas'
import settings from './settings/sagas'

export default (config, sagas = []) => {
  return function* rootSaga() {
    yield all([menu(), settings(), ...sagas])
  }
}
