import React from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'

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

class RemoteSelect extends React.Component {
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
    // No need to call API search without value
    if (!value) {
      return
    }

    this.setState({ data: [], fetching: true })

    const {
      remoteSearch: { apiFn, paramSearchQuery },
    } = this.props

    const params = {}
    params[paramSearchQuery] = value

    const data = await apiFn(params)

    this.setState({ data, fetching: false })
  }

  handleChange = value => {
    const {
      // form,
      // field,
      onChange,
    } = this.props

    // const { setFieldsValue } = form

    onChange(value)

    // setFieldsValue({ [field]: value })

    this.setState({
      value,
      data: [],
      fetching: false,
    })
  }

  render() {
    const { fetching, data, value } = this.state

    const {
      remoteSearch: { apiFn, paramSearchQuery, ...rest },
    } = this.props

    return (
      <Select
        {...rest}
        // DO NOT modify below default props
        showSearch
        initialValue={value}
        onSearch={this.fetchData}
        onChange={this.handleChange}
        notFoundContent={fetching ? <Spin size="small" /> : null}
      >
        {data.map(d => {
          const isString = typeof d === 'string'

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
