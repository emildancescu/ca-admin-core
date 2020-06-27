import React from 'react'
import { ConfigProvider } from 'antd'
import { IntlProvider, addLocaleData } from 'react-intl'
import { connect } from 'react-redux'
import english from 'locales/en'
import romanian from 'locales/ro'
import ukrainean from 'locales/uk'
import russian from 'locales/ru'

addLocaleData(english.localeData)
addLocaleData(romanian.localeData)
addLocaleData(ukrainean.localeData)
addLocaleData(russian.localeData)

const locales = {
  en: english,
  ro: romanian,
  uk: ukrainean,
  ru: russian,
}

@connect(({ settings }) => ({ settings }))
class Localization extends React.Component {
  render() {
    const {
      children,
      settings: { locale },
    } = this.props
    const currentLocale = locales[locale]
    return (
      <ConfigProvider locale={currentLocale.antdData}>
        <IntlProvider locale={currentLocale.locale} messages={currentLocale.messages}>
          {children}
        </IntlProvider>
      </ConfigProvider>
    )
  }
}

export default Localization
