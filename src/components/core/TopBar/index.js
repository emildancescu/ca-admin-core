// import ProjectManagement from './ProjectManagement'
// import Breadcrumbs from '../Breadcrumbs'
import * as React from 'react'
import ProfileMenu from './ProfileMenu'
import LanguageSelector from './LanguageSelector'
import styles from './style.module.scss'
import { AdminContext } from '../Admin'

const TopBar = () => {
  const adminCtx = React.useContext(AdminContext)

  return (
    <div className={styles.topbar}>
      <div className="mr-auto" />
      {adminCtx.topBarComp && adminCtx.topBarComp()}
      <LanguageSelector />
      <ProfileMenu />
    </div>
  )
}

export default TopBar
