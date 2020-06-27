import store from 'store'
import actions from './actions'

const STORED_SETTINGS = storedSettings => {
  const settings = {}
  Object.keys(storedSettings).forEach(key => {
    const item = store.get(`app.settings.${key}`)

    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]

    if (key === 'locale' && settings[key].length > 2) {
      // prevent issue with stored locale settings in the form of: en-US,
      // after switching to the simplified form (en)
      settings.locale = storedSettings.locale
    }
  })

  return settings
}

const initialState = {
  ...STORED_SETTINGS({
    isMobileView: false,
    isMobileMenuOpen: false,
    isLightTheme: false,
    isSettingsOpen: false,
    isMenuTop: false,
    isMenuCollapsed: false,
    isBorderless: true,
    isSquaredBorders: false,
    isFixedWidth: false,
    isMenuShadow: false,
    locale: 'en',
  }),
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
