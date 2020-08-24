import React from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'

const { Option } = Select

class RemoteSelect extends React.Component {
  constructor(props) {
    super(props)
    this.fetchUser = debounce(this.fetchUser, 800)
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  }

  fetchUser = async value => {
    // No need to call API search without value
    if (!value) {
      return
    }

    this.setState({ data: [], fetching: true })

    const { apiFn, paramSearchQuery } = this.props

    const params = {}
    params[paramSearchQuery] = value

    const data = await apiFn(params)

    this.setState({ data, fetching: false })
  }

  handleChange = value => {
    const { form, field } = this.props

    const { setFieldsValue } = form

    setFieldsValue({ [field]: value })

    this.setState({
      value,
      data: [],
      fetching: false,
    })
  }

  render() {
    const { fetching, data, value } = this.state

    return (
      <Select
        mode="multiple"
        // labelInValue
        initialValue={value}
        placeholder="Select users"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => {
          return (
            <Option key={d} value={d.value}>
              {d.text}
            </Option>
          )
        })}
      </Select>
    )
  }
}

export default RemoteSelect
