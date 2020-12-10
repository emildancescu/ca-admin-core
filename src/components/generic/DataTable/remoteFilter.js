import React from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import isObject from 'lodash/isObject'

const { Option } = Select

let latestFetch = 0

class RemoteFilter extends React.Component {
  constructor(props) {
    super(props)
    this.fetchData = debounce(this.fetchData, 800)
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  }

  fetchData = async value => {
    if (!value) {
      return
    }

    this.setState({ data: [], fetching: true })

    const {
      remoteSearch: { apiFn, paramSearchQuery },
    } = this.props

    const params = {}
    params[paramSearchQuery] = value

    // Update state 'data' with latest triggered fetch
    latestFetch += 1
    const fetchID = latestFetch

    const data = await apiFn(params)

    if (fetchID === latestFetch) {
      this.setState({ data, fetching: false })
    }
  }

  handleChange = value => {
    const {
      tableDropdownFn: { setSelectedKeys, confirm },
    } = this.props

    setSelectedKeys(value ? [value] : null)

    confirm()

    this.setState({
      value,
      data: [],
      fetching: false,
    })
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { fetching, data, value } = this.state

    const {
      remoteSearch: { apiFn, paramSearchQuery, styleSelect, ...rest },
    } = this.props

    return (
      <Select
        {...rest}
        // DO NOT modify below default props
        style={styleSelect ? { ...styleSelect } : { width: '100%', marginBottom: 8, marginTop: 8 }}
        showSearch
        onSearch={this.fetchData}
        onChange={this.handleChange}
        onFocus={() => this.fetchData(' ')}
        notFoundContent={fetching ? <Spin size="small" /> : null}
      >
        {data.map(d => {
          const isString = !isObject(d)

          return (
            <Option key={d} value={isString ? d : d.value} title={isString ? d : d.text}>
              {isString ? d : d.text}
            </Option>
          )
        })}
      </Select>
    )
  }
}

export default RemoteFilter
