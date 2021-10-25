import React from 'react'
import { DataTable, net, getToken } from 'lib'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, Radio, Tag } from 'antd'
import { load } from '../list/actions'

const { api, get } = net

const API_USERS = `https://stage.api.citylink.ro/api/v1/admin/users`

const getUsers = params => get(API_USERS, params, getToken())

const remoteFilterUsersFirstName = {
  filterOption: false,
  mode: 'single',
  paramSearchQuery: 'search',
  allowClear: true,
  styleColumn: { padding: 8, width: '200px' },
  styleSelect: { width: '100%', marginBottom: 8, marginTop: 8 },
  apiFn: async params => {
    let result = []

    params = {
      ...params,
      // limit: 5,
    }

    await api(getUsers(params))
      .then(response => response.json())
      .then(json => {
        result = json.data.map(user => ({
          text: `${user.id} - ${user.first_name}`,
          value: user.id,
        }))
      })

    return result
  },
}

const remoteFilterUsersLastName = {
  filterOption: false,
  mode: 'single',
  paramSearchQuery: 'search',
  allowClear: true,
  styleColumn: { padding: 8, width: '200px' },
  styleSelect: { width: '100%', marginBottom: 8, marginTop: 8 },
  apiFn: async params => {
    let result = []

    params = {
      ...params,
      // limit: 5,
    }

    await api(getUsers(params))
      .then(response => response.json())
      .then(json => {
        result = json.data.map(user => ({
          text: `${user.id} - ${user.last_name}`,
          value: user.id,
        }))
      })

    return result
  },
}

@withRouter
@connect(({ users }) => ({ users }))
class Table extends React.Component {
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
        title: 'roles',
        dataIndex: 'roles',
        render: roles => roles.map(role => <Tag key={role}>{role}</Tag>),
        filters: [
          { text: 'client', value: 'client' },
          { text: 'operator', value: 'operator' },
          { text: 'bike-operator', value: 'bike-operator' },
          { text: 'fleet-operator', value: 'fleet-operator' },
          { text: 'admin', value: 'admin' },
        ],
        mobile: false,
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
        // Only 1 column allowed with this prop
        defaultSortOrder: 'ascend',
      },
      {
        title: 'first_name',
        dataIndex: 'first_name',
        sorter: true,
        remoteFilter: remoteFilterUsersFirstName,
      },
      {
        title: 'last_name',
        dataIndex: 'last_name',
        sorter: true,
        remoteFilter: remoteFilterUsersLastName,
      },
      {
        title: 'email',
        dataIndex: 'email',
        sorter: true,
        excludeFromColumnSelector: true,
      },
      {
        title: 'No dataIndex',
        key: 'actions',
        render: () => Math.floor(Math.random() * 100),
      },
      ...this.getExtraColumns(view),
    ]

    return (
      <Card title={<strong>DataTable</strong>} extra={extra}>
        <DataTable
          columns={columns}
          dataSource={users}
          loadAction={load}
          showColumnSelector
          settingsKey="users"
        />
      </Card>
    )
  }
}

export default Table
