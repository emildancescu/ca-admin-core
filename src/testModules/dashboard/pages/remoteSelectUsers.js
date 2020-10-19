/* eslint-disable camelcase */
import React from 'react'
import { Form, getToken } from 'lib'

const API = `https://stage.api.citylink.ro/api/v1/admin/users`

const API_CITYRIDE = `https://stage.crm.api.cityride.tech/api/v1/options`

const token_cityride = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNGRjMmI4MjhmYjYzN2JhYzNkYjZiMDBkNDhjMTE0ZDJmZGM4MGU3OTg0YzViMjYzNTRkMzdhMzVjMjczOTJkMjk3NDI5OWQ4N2U5NDc3YzAiLCJpYXQiOjE1ODg4NDE2NjYsIm5iZiI6MTU4ODg0MTY2NiwiZXhwIjoxNjIwMzc3NjY2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.bxGKiBhryz6g92jDEd4-rCuHT1VexITF_w1cvv5u-rG1FS4LPLVYlXf9jPoO7zNd0g1vsMOMf7NqZZIQsLw9D8BlZa_EHeT8o4GoLxP4Xi22372yU4LFIETFsrhgonqmAhbd_GDm8W7CHiJoEphE0NuwRZQVg3rH796_SaRFxLhU29d6cTjrUjXjwgwmQhtgZOwnGwSEEeLXdDaR41tGXnREItkbzjL8m0GrNa8kq6Es0Vq6SYMGj1Y6aCXmWxSOnHyOu8_hTCA4vHYm-wjfT0A3igbFBiYkNXM_521ox-TW8MOr8kwpe7ahrdXP_hF46K5jQ24m3jcvKaO9BEmECchGVUwYud8a_8tEPM2rjiZGfHSPzuSlyzlrntTpwqESinuJOW6_X_TE_WlojuVSEjmy20WCzVQgc2zXHOeB9HWwRgVP14sHq-zvUmW8Jqg3_kcCQmYx0lI0m9vLW9IRNztx7XQsduJ55tQvR29jaRMmNhRYcDrAnw6eS6V2UD0gYfrx_kn6zOVT5L9NS9gnxNhnbKz83tm1foP8zfXUqPhWmWnbHKMeGF1GFtQcSakHGkQvGY0jMH4FIaVyHQS8kxVc_55Q91agpCZvQ_gsm3sUgIVrFYAObtinnX90dat9rZgtNMhlz2imPRDlFrG9unLInzbBbbNPT4ZhSo_WLug`

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

const someOptions = [
  {
    id: 2,
    name: 'Non-smoking driver',
    type: 'driver',
  },
  {
    id: 14,
    name: 'No conversations',
    type: 'client',
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

const remoteSearchCityrideOptionsClient = {
  filterOption: false,
  mode: 'multiple',
  paramSearchQuery: 'search',
  async apiFn(params) {
    let result = []

    const token = token_cityride
    const url = new URL(API_CITYRIDE)

    url.searchParams.append('filters[type]', 'client')

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
          text: obj.name,
          value: obj.id,
        }))
      })
    return result
  },
}

const remoteSearchCityrideOptionsDriver = {
  filterOption: false,
  mode: 'multiple',
  paramSearchQuery: 'search',
  async apiFn(params) {
    let result = []

    const token = token_cityride
    const url = new URL(API_CITYRIDE)

    url.searchParams.append('filters[type]', 'driver')

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
          text: obj.name,
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
      users_multiple: someUsers.map(obj => obj.id),
      users_single: null,
      options: {
        client: someOptions.filter(el => el.type !== 'driver').map(el => el.id),
        driver: someOptions.filter(el => el.type !== 'client').map(el => el.id),
      },
      date: null,
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
      {
        label: 'Cityride Options',
        field: 'options',
        items: [
          {
            label: 'Client',
            field: 'options.client',
            type: 'remoteSelect',
            remoteSearch: remoteSearchCityrideOptionsClient,
            options: someOptions
              .filter(el => el.type !== 'driver')
              .map(el => {
                return { text: el.name, value: el.id }
              }),
          },
          {
            label: 'Driver',
            field: 'options.driver',
            type: 'remoteSelect',
            remoteSearch: remoteSearchCityrideOptionsDriver,
            options: someOptions
              .filter(el => el.type !== 'client')
              .map(el => {
                return { text: el.name, value: el.id }
              }),
          },
        ],
      },
      {
        label: 'Datepicker',
        field: 'date',
        type: 'date',
        placeholder: 'aasdaddsda',
      },
    ]

    return <Form onSubmit={this.handleSubmit} config={formConfig} values={implicitValues} />
  }
}

export default RemoteSelectUsers
