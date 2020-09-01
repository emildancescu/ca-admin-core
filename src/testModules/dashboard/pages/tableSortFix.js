import React from 'react'
import { DataTable } from 'lib'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, Radio } from 'antd'
import { load } from '../list/actions'

@withRouter
@connect(({ users }) => ({ users }))
class TableFix extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'default',
    }
  }

  getExtraColumns = view => {
    if (view === 'default') {
      return []
    }

    return [
      {
        title: 'Phone',
        dataIndex: 'phone_number',
        sorter: true,
      },
      {
        title: 'Roles',
        dataIndex: 'roles',
      },
    ]
  }

  handleViewChange = e => {
    this.setState({ view: e.target.value })
  }

  render() {
    const { users } = this.props

    const { view } = this.state

    const extra = [
      <Radio.Group
        key="view"
        value={view}
        onChange={e => this.handleViewChange(e)}
        className="mr-2"
      >
        <Radio.Button value="default">Default</Radio.Button>
        <Radio.Button value="info">Info</Radio.Button>
      </Radio.Group>,
    ]

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        sorter: true,
      },
      {
        title: 'first_name',
        dataIndex: 'first_name',
        sorter: true,
        hidden: true,
      },
      {
        title: 'last_name',
        dataIndex: 'last_name',
        sorter: true,
      },
      {
        title: 'email',
        dataIndex: 'email',
        sorter: true,
      },
      ...this.getExtraColumns(view),
    ]

    return (
      <Card title={<strong>TableFixTest</strong>} extra={extra}>
        <DataTable columns={columns} dataSource={users} loadAction={load} />
      </Card>
    )
  }
}

export default TableFix
