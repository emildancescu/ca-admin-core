import React from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import isObject from 'lodash/isObject'
import isEqual from 'lodash/isEqual'

const { Option } = Select

/* Props explaining:

remoteSearch: {
  filterOption: false, 
      // From Antd
  mode: "multiple", 
      // From Antd
  {...rest}  
      // Can contain ANTD Select props from documentation
  paramSearchQuery: 'search', 
      **REQUIRED** The actual query for URL 
  apiFn(params), 
      **REQUIRED** Should return an array of desired values. Can use fetch, axios etc ...
}

apiFn example : 
.then(response => response.json())
.then(body => {
  // OBJECT with text - value
  result = body.data.map(user => ({
    text: `${user.first_name} ${user.last_name}`,
    value: user.id,
  }));

  // ARRAY as desired form
  result = body.data.map(user => user.first_name);
});

*/

let latestFetch = 0

class RemoteSelect extends React.Component {
  constructor(props) {
    super(props)
    const {
      itemConfig: { options },
    } = this.props

    this.fetchData = debounce(this.fetchData, 800)

    this.state = {
      data: [],
      // eslint-disable-next-line react/no-unused-state
      value: [],
      fetching: false,
      preOptions: options || [],
    }
  }

  componentDidUpdate = prevProps => {
    const {
      itemConfig: { options },
    } = this.props

    const {
      itemConfig: { options: prevOptions },
    } = prevProps

    if (!isEqual(prevOptions, options)) {
      this.setState({
        preOptions: options,
      })
    }
  }

  fetchData = async value => {
    // No need to call API search without value
    if (!value) {
      return
    }

    this.setState({ data: [], fetching: true })

    const {
      itemConfig: {
        remoteSearch: { apiFn, paramSearchQuery },
      },
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

  handleChange = (value, option) => {
    const {
      onChange,
      itemConfig: {
        remoteSearch: { mode },
      },
    } = this.props

    onChange(value)

    let preOptionsValue = []

    if (mode === 'multiple') {
      preOptionsValue = option.map(el => {
        return {
          text: el.props.title,
          value: el.props.value,
        }
      })
    } else if (option) {
      preOptionsValue.push({
        text: option.props.title,
        value: option.props.value,
      })
    }

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      value,
      data: [],
      fetching: false,
      preOptions: preOptionsValue,
    })
  }

  render() {
    const { fetching, data, preOptions } = this.state

    const {
      itemConfig: {
        remoteSearch: { apiFn, paramSearchQuery, ...restRS },
        disabled,
      },
      // pass value from Form's getFieldDecorator() to <Select>
      ...restProps
    } = this.props

    const dataFiltered = data.filter(x => !preOptions.some(y => y.value === x.value))

    const newData = dataFiltered.concat(preOptions)

    return (
      <Select
        {...restRS}
        // DO NOT modify below default props
        {...restProps}
        disabled={disabled}
        showSearch
        allowClear
        onSearch={this.fetchData}
        onFocus={() => this.fetchData(' ')}
        onChange={this.handleChange}
        notFoundContent={fetching ? <Spin size="small" /> : null}
      >
        {newData.map(d => {
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

export default RemoteSelect
