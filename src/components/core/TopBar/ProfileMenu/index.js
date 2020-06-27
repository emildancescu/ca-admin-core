import React from 'react'
import { connect } from 'react-redux'
import { Menu, Dropdown, Avatar } from 'antd'
import { FormattedMessage } from 'react-intl'
// import { APP_LAST_UPDATE } from 'utils/constants'
import styles from './style.module.scss'

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  reload = () => {
    window.location.reload(true)
  }

  render() {
    const { user } = this.props
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <div>
            <FormattedMessage id="topBar.profileMenu.hello" />,{' '}
            <strong>{user.name || 'Anonymous'}</strong>
          </div>
          <div>
            <strong>
              <FormattedMessage id="topBar.profileMenu.role" />:{' '}
            </strong>
            {user.roles.join(', ')}
          </div>
        </Menu.Item>
        <Menu.Divider />
        {/* <Menu.Item>
          <a href="#">
            <i className={`${styles.menuIcon} icmn-user`} />
            <FormattedMessage id="topBar.profileMenu.editProfile" />
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item disabled>Last updated: {APP_LAST_UPDATE}</Menu.Item> */}
        <Menu.Item>
          <a href="#" onClick={this.reload}>
            <i className={`${styles.menuIcon} icmn-spinner11`} />
            <FormattedMessage id="topBar.profileMenu.refresh" />
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="#" onClick={this.logout}>
            <i className={`${styles.menuIcon} icmn-exit`} />
            <FormattedMessage id="topBar.profileMenu.logout" />
          </a>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={styles.dropdown}>
          <Avatar className={styles.avatar} shape="square" size="large" icon="user" />
        </div>
      </Dropdown>
    )
  }
}

export default ProfileMenu
