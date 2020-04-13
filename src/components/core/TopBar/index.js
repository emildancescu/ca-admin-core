import React from 'react'
// import ProjectManagement from './ProjectManagement'
import ProfileMenu from './ProfileMenu'
import LanguageSelector from './LanguageSelector'
// import Breadcrumbs from '../Breadcrumbs'
import styles from './style.module.scss'

class TopBar extends React.Component {
  render() {
    return (
      <div className={styles.topbar}>
        <div className="mr-auto" />
        <div className="mr-4">
          <LanguageSelector />
        </div>
        <ProfileMenu />
      </div>
    )
  }
}

export default TopBar
