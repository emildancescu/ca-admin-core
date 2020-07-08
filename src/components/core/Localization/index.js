import React from 'react'
import { ConfigProvider } from 'antd'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'

import english from 'locales/en'
import romanian from 'locales/ro'
import ukrainean from 'locales/uk'
import russian from 'locales/ru'

const locales = {
  en: english,
  ro: romanian,
  uk: ukrainean,
  ru: russian,
}

@connect(({ settings }) => ({ settings }))
class Localization extends React.Component {
  constructor(props) {
    super(props)

    const { locales: messages } = props

    this.processMessages(messages)
  }

  processMessages = messages => {
    const reindexedMessages = {}

    Object.values(messages).forEach(chunk => {
      Object.keys(chunk).forEach(lang => {
        reindexedMessages[lang] = {
          ...reindexedMessages[lang],
          ...chunk[lang],
        }
      })
    })

    // console.log('reindexedMessages', reindexedMessages)
    this.messages = reindexedMessages
  }

  render() {
    const {
      children,
      settings: { locale },
    } = this.props

    const currentLocale = locales[locale] || english

    return (
      <ConfigProvider locale={currentLocale.antdData}>
        <IntlProvider
          locale={currentLocale.locale}
          defaultLocale="en"
          messages={{ ...currentLocale.messages, ...this.messages[locale] }}
        >
          {children}
        </IntlProvider>
      </ConfigProvider>
    )
  }
}

export default Localization
