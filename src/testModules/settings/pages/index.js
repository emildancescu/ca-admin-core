import React from 'react'
import { Card } from 'antd'
import { Authorize } from 'lib'

class Settings extends React.Component {
  render() {
    return (
      <Card title={<strong className="text-uppercase">Settings</strong>}>
        <p>Settings</p>

        <Authorize roles={['dynamic-role']}>Authorize dynamic role</Authorize>
      </Card>
    )
  }
}

export default Settings
