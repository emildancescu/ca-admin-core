// import ProjectManagement from './ProjectManagement'
// import Breadcrumbs from '../Breadcrumbs'
import * as React from 'react'
import { connect } from 'react-redux'
import ProfileMenu from './ProfileMenu'
import LanguageSelector from './LanguageSelector'
import styles from './style.module.scss'
import { AdminContext } from '../Admin'

const TopBar = () => {
  const adminCtx = React.useContext(AdminContext)

  const extraTopBar = () => {
    if (!adminCtx.topBarExtra) {
      return null
    }

    const ToRender = connect(adminCtx.topBarExtra.reduxStore)(adminCtx.topBarExtra.component)

    return <ToRender />
  }

  return (
    <div className={styles.topbar}>
      {extraTopBar()}

      <div className="ml-auto" style={{ display: 'inline-flex' }}>
        <LanguageSelector />
        <ProfileMenu />
      </div>
    </div>
  )
}

export default TopBar
