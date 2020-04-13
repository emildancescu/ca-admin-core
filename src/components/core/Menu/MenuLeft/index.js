import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import store from 'store'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'lodash'
import styles from './style.module.scss'

const { Sider } = Layout
const { SubMenu, Divider } = Menu

const mapStateToProps = ({ menu, settings }) => ({
  badges: menu.badges,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isLightTheme: settings.isLightTheme,
})

@withRouter
@connect(mapStateToProps)
class MenuLeft extends React.Component {
  state = {
    selectedKeys: store.get('app.menu.selectedKeys') || [],
    openedKeys: store.get('app.menu.openedKeys') || [],
  }

  componentDidMount() {
    this.setSelectedKeys()
  }

  componentDidUpdate(prevProps) {
    const { isMenuCollapsed, isMobileView } = this.props

    if (prevProps.isMenuCollapsed !== isMenuCollapsed && !isMobileView) {
      this.clearOpenedKeys()
    }
  }

  clearOpenedKeys = () => {
    this.setState({
      openedKeys: [],
    })
    store.set('app.menu.openedKeys', [])
  }

  setSelectedKeys = () => {
    const { menu, location } = this.props

    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])

    const selectedItem = _.find(flattenItems(menu, 'children'), ['url', location.pathname])

    const {
      selectedKeys: [currentSelection],
    } = this.state

    // only update state when necessary
    if (selectedItem && selectedItem.key !== currentSelection) {
      this.setState({
        selectedKeys: selectedItem ? [selectedItem.key] : [],
      })
    }
  }

  onCollapse = (value, type) => {
    const { dispatch, isMenuCollapsed } = this.props
    if (type === 'responsive' && isMenuCollapsed) {
      return
    }

    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    })

    this.setState({
      openedKeys: [],
    })
  }

  onOpenChange = openedKeys => {
    store.set('app.menu.openedKeys', openedKeys)
    this.setState({
      openedKeys,
    })
  }

  handleClick = e => {
    store.set('app.menu.selectedKeys', [e.key])
    this.setState({
      selectedKeys: [e.key],
    })
  }

  generateMenuItems = () => {
    const { menu = [], badges } = this.props
    const generateItem = item => {
      const { key, title, url, icon, disabled, badge } = item
      if (item.divider) {
        return <Divider key={Math.random()} />
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            {item.target ? (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
                <span className={styles.title}>{title}</span>
                {badge && (
                  <span className="badge badge-light badge-collapsed-hidden ml-2">
                    {badges[badge]}
                  </span>
                )}
              </a>
            ) : (
              <Link to={url}>
                {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
                <span className={styles.title}>{title}</span>
                {badge && (
                  <span className="badge badge-light badge-collapsed-hidden ml-2">
                    {badges[badge]}
                  </span>
                )}
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
          <span className={styles.title}>{title}</span>
          {badge && (
            <span className="badge badge-light badge-collapsed-hidden ml-2">{badges[badge]}</span>
          )}
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              <span className={styles.title}>{menuItem.title}</span>
              {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
            </span>
          )
          return (
            <SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </SubMenu>
          )
        }
        return generateItem(menuItem)
      })

    return menu.map(menuItem => {
      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            <span className={styles.title}>{menuItem.title}</span>
            {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
          </span>
        )
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  render() {
    const { selectedKeys, openedKeys } = this.state
    const { isMobileView, isMenuCollapsed, isLightTheme } = this.props
    const menuSettings = isMobileView
      ? {
          width: 256,
          collapsible: false,
          collapsed: false,
          onCollapse: this.onCollapse,
        }
      : {
          width: 256,
          collapsible: true,
          collapsed: isMenuCollapsed,
          onCollapse: this.onCollapse,
          breakpoint: 'lg',
        }

    const menu = this.generateMenuItems()

    return (
      <Sider
        {...menuSettings}
        className={isLightTheme ? `${styles.menu} ${styles.light}` : styles.menu}
      >
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            <img
              src={`/resources/images/logo${menuSettings.collapsed ? '-mobile' : ''}.png`}
              alt=""
            />
          </div>
        </div>
        <Scrollbars
          className={isMobileView ? styles.scrollbarMobile : styles.scrollbarDesktop}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                width: '4px',
                borderRadius: 'inherit',
                backgroundColor: '#c5cdd2',
                left: '1px',
              }}
            />
          )}
          autoHide
        >
          <Menu
            theme={isLightTheme ? 'light' : 'dark'}
            onClick={this.handleClick}
            selectedKeys={selectedKeys}
            openKeys={openedKeys}
            onOpenChange={this.onOpenChange}
            mode="inline"
            className={styles.navigation}
          >
            {menu}
          </Menu>
        </Scrollbars>
      </Sider>
    )
  }
}

export default MenuLeft
