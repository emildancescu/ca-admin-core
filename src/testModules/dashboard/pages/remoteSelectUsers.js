import React from 'react'
import { Form, getToken } from 'lib'

const API = `https://stage.api.citylink.ro/api/v1/admin/users`

const someUsers = [
  {
    id: 627,
    first_name: 'Nico',
    last_name: 'Pushwoosh',
  },
  {
    id: 626,
    first_name: 'Stroe',
    last_name: 'Catalin',
  },
]

const remoteSearchUsersMultiple = {
  filterOption: false,
  mode: 'multiple',
  paramSearchQuery: 'search',
  async apiFn(params) {
    let result = []

    const token = getToken()
    const url = new URL(API)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    const fetchOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }

    await fetch(url, fetchOptions)
      .then(response => response.json())
      .then(body => {
        result = body.data.map(obj => ({
          text: `${obj.first_name} ${obj.last_name}`,
          value: obj.id,
        }))
      })
    return result
  },
}

const remoteSearchUsersSingle = {
  filterOption: false,
  mode: 'default',
  paramSearchQuery: 'search',
  async apiFn(params) {
    let result = []

    const token = getToken()
    const url = new URL(API)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    const fetchOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }

    await fetch(url, fetchOptions)
      .then(response => response.json())
      .then(body => {
        result = body.data.map(obj => ({
          text: `${obj.first_name} ${obj.last_name}`,
          value: obj.id,
        }))
      })
    return result
  },
}

class RemoteSelectUsers extends React.Component {
  handleSubmit = values => {
    console.log('handleSubmit values form: ', values)
  }

  render() {
    const implicitValues = {
      // either with initialValue
      users_multiple: someUsers.map(obj => obj.id),
      users_single: 627,
    }

    const formConfig = [
      {
        label: 'Users Multiple',
        field: 'users_multiple',
        type: 'remoteSelect',
        remoteSearch: remoteSearchUsersMultiple,
        // either with implicitValues
        // initialValue: someUsers.map((obj => obj.id)),
        options: someUsers.map(obj => {
          return { text: `${obj.first_name} ${obj.last_name}`, value: obj.id }
        }),
      },
      {
        label: 'Users Single',
        field: 'users_single',
        type: 'remoteSelect',
        remoteSearch: remoteSearchUsersSingle,
        // either with implicitValues
        // initialValue: 627,
        options: [{ text: 'Nico Pushwoosh', value: 627 }],
      },
    ]

    return <Form onSubmit={this.handleSubmit} config={formConfig} values={implicitValues} />
  }
}

export default RemoteSelectUsers
