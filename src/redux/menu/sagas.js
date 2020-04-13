import { all } from 'redux-saga/effects'

export function* GET_DATA() {
  // yield put({
  //   type: 'menu/SET_STATE',
  //   payload: {
  //   },
  // })
}

export default function* rootSaga() {
  yield all([
    GET_DATA(), // run once on app load to fetch menu data
  ])
}
