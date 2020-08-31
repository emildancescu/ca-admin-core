import React from 'react'
import { DataTable } from 'lib'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { load } from '../list/actions'

@withRouter
@connect(({ users }) => ({ users }))
class TableFix extends React.Component {
  render() {
    const { users } = this.props

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
    ]
    return users && <DataTable columns={columns} dataSource={users} loadAction={load} />
  }
}

export default TableFix
