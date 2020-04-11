import { all, take, takeEvery, put } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import store from 'store'
import actions from './actions'

function* isMobileView(load = false) {
  const currentState = window.innerWidth < 768
  const prevState = store.get('app.settings.isMobileView')
  if (currentState !== prevState || load) {
    yield CHANGE_SETTING({
      payload: {
        setting: 'isMobileView',
        value: currentState,
      },
    })
  }
}

function* CHANGE_SETTING({ payload: { setting, value } }) {
  yield store.set(`app.settings.${setting}`, value)
  yield put({
    type: 'settings/SET_STATE',
    payload: {
      [setting]: value,
    },
  })
}

function* SETUP() {
  const channel = eventChannel(emitter => {
    const onResize = e => {
      // send the event to our saga
      emitter(e)
    }

    window.addEventListener('resize', onResize)

    // return an unsubscribe method
    return () => {
      window.removeEventListener('resize', onResize)
    }
  })

  // detect isMobileView setting on app load and window resize
  yield isMobileView(true)

  // process events until operation completes
  while (true) {
    yield take(channel)
    yield isMobileView()
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    SETUP(), // run once on app load to init listeners
  ])
}
