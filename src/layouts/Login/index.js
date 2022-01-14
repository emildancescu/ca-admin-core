import React from 'react'
import { Layout } from 'antd'
import { Link, withRouter } from 'react-router-dom'

import LanguageSelector from 'components/core/TopBar/LanguageSelector'

import styles from './style.module.scss'

@withRouter
class LoginLayout extends React.PureComponent {
  render() {
    const { children } = this.props

    return (
      <Layout>
        <Layout.Content>
          <div className={styles.layout}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <Link to="/">
                  <img src="/resources/images/logo.png" alt="" />
                </Link>
              </div>
              <LanguageSelector />
            </div>
            <div className={styles.content}>{children}</div>
          </div>
        </Layout.Content>
      </Layout>
    )
  }
}

export default LoginLayout
