import React from 'react'
import { Menu, Dropdown } from 'antd'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@connect(({ settings }) => ({ settings }))
class LanguageSelector extends React.Component {
  changeLang = ({ key }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'locale',
        value: key,
      },
    })
  }

  render() {
    const {
      settings: { locale },
    } = this.props
    const language = locale.substr(0, 2)

    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[locale]} onClick={this.changeLang}>
        <Menu.Item key="en">
          <span role="img" aria-label="English" className="mr-2">
            🇬🇧
          </span>
          English
        </Menu.Item>
        <Menu.Item key="ro">
          <span role="img" aria-label="Romana" className="mr-2">
            🇷🇴
          </span>
          Romana
        </Menu.Item>
        <Menu.Item key="uk">
          <span role="img" aria-label="Ukrainean" className="mr-2">
            🇺🇦
          </span>
          Українська
        </Menu.Item>
        <Menu.Item key="ru">
          <span role="img" aria-label="Russian" className="mr-2">
            🇷🇺
          </span>
          Русский
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} trigger={['click']}>
        <div className={styles.dropdown}>
          <strong className="text-uppercase">{language}</strong>
        </div>
      </Dropdown>
    )
  }
}

export default LanguageSelector
