import React from 'react'
import { Card, Tag } from 'antd'
import { Authorize } from 'lib'

class Settings extends React.Component {
  render() {
    return (
      <Card title={<strong className="text-uppercase">Settings</strong>}>
        <p>Settings</p>

        <Authorize roles={['dynamic-role']}>Authorize dynamic role</Authorize>

        <Authorize permissions={['test', 'permissions']}>
          <div style={{ display: 'inline-block' }}>Test</div>
        </Authorize>

        <span>
          <Authorize permissions={['test', 'permissions']}>
            {['a', 'b'].map(elem => (
              <Tag key={elem}>{elem}</Tag>
            ))}
          </Authorize>
        </span>
      </Card>
    )
  }
}

export default Settings
