import React from 'react'
import { Tabs, Icon, Modal } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classnames from 'classnames'

const { TabPane } = Tabs

@withRouter
@connect(({ settings }) => ({ settings }))
class DetailsModal extends React.Component {
  state = {
    modalVisible: true,
  }

  handleCancel = () => {
    const {
      history,
      location: { state },
      backLocation,
    } = this.props

    this.setState({
      modalVisible: false,
    })

    // when opening an user profile url directly
    // (by clicking a link or typing it in the browser address bar)
    // going back is not possible or might have unwanted consequences
    // (e.g. go back to a blank page), so we should avoid it
    // modal=true is only set while normally navigating the app
    if (state && state.modal) {
      history.goBack()
    } else if (backLocation) {
      history.push(backLocation)
    }
  }

  render() {
    const { modalVisible } = this.state
    const {
      settings: { isMobileView },
      title: modalTitle,
      titleComponent,
      children,
      tabs,
      location: { hash, state: { selectedTab } = {} },
      history,
    } = this.props

    const tabTitle = (icon, title) => (
      <span>
        <Icon className={classnames({ 'mr-0': isMobileView })} type={icon} />
        {isMobileView ? '' : ` ${title}`}
      </span>
    )

    let defaultActiveKey = ''

    if (hash !== '') {
      defaultActiveKey = hash.replace('#', '')
    } else {
      defaultActiveKey = selectedTab
    }

    return (
      <div>
        <Helmet title={modalTitle} />

        <Modal
          visible={modalVisible}
          title={
            <div>
              {modalTitle} {titleComponent}
            </div>
          }
          style={{ maxWidth: isMobileView ? null : 1240, top: isMobileView ? 72 : 80 }}
          width={isMobileView ? null : '90%'}
          onCancel={this.handleCancel}
          footer={null}
        >
          {tabs && (
            <Tabs
              onTabClick={key => {
                history.replace({ hash: key, state: { modal: true } })
              }}
              type={isMobileView ? 'card' : 'line'}
              defaultActiveKey={defaultActiveKey}
            >
              {tabs.map(tab => (
                <TabPane
                  tab={tabTitle(tab.icon, tab.title)}
                  key={tab.key || tab.title.toLowerCase()}
                >
                  {tab.component}
                </TabPane>
              ))}
            </Tabs>
          )}

          {children}
        </Modal>
      </div>
    )
  }
}

export default DetailsModal
