import React from 'react'
import { Table, Input, Row, Col, Button, Tooltip } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'

// we need acces to the dispatch prop
@connect(({ settings: { isMobileView } }) => ({ isMobileView }))
class DataTable extends React.Component {
  state = {
    params: {
      search: '',
      page: 1,
      limit: 25, // default page size
    },
  }

  componentDidMount() {
    // perform initial load
    this.load()
  }

  componentDidUpdate(prevProps) {
    const { filters, loadActionPayload } = this.props

    if (!_.isEqual(prevProps.filters, filters)) {
      // reload if prop filters have changed, while also clearing previous filters
      this.handleClearFilters()
    }

    if (!_.isEqual(prevProps.loadActionPayload, loadActionPayload)) {
      this.handlePayloadChange()
    }
  }

  load = () => {
    const { dispatch, loadAction, filters, loadActionPayload } = this.props
    let { params } = this.state

    // if filters have been set as a prop, merge with the ones from state
    if (filters) {
      params = {
        ...params,
        filters: {
          ...params.filters,
          ...filters,
        },
      }
    }

    // if extra load action params were set as a prop, merge with those as well
    if (loadActionPayload) {
      params = {
        ...params,
        ...loadActionPayload,
      }
    }

    dispatch(loadAction(params))
  }

  handleTableChange = (pagination, filters, sorter) => {
    const {
      params: { search },
    } = this.state

    // only keep the search value from the old params object, the rest should be rebuilt
    let params = {
      search,
      page: pagination.current,
      limit: pagination.pageSize,
    }

    // only keep non null filters
    const cleanFilters = Object.entries(filters).filter(entry => entry[1] !== null)

    if (cleanFilters.length !== 0) {
      params = {
        ...params,
        filters: Object.fromEntries(cleanFilters),
      }
    }

    // only store sorter if it's non empty, otherwise the API might fail
    if (sorter.field) {
      params = {
        ...params,
        sorter: {
          field: sorter.field,
          order: sorter.order === 'ascend' ? 'ASC' : 'DESC',
        },
      }
    }

    // persist the final object so we can use it when searching
    this.setState({ params }, () => this.load())
  }

  handleSearch = search => {
    let { params } = this.state

    params = {
      ...params,
      page: 1, // reset current page when searching
      search,
    }

    this.setState({ params }, () => this.load())
  }

  handleSearchInputChange = e => {
    const { params } = this.state

    this.setState({
      params: {
        ...params,
        search: e.target.value,
      },
    })
  }

  handleClearFilters = () => {
    const {
      params: { limit },
    } = this.state

    const params = {
      limit,
      page: 1,
      search: '',
    }

    this.setState({ params }, () => this.load())
  }

  handlePayloadChange = () => {
    const { params } = this.state

    this.setState(
      {
        params: {
          ...params,
          page: 1,
        },
      },
      () => this.load(),
    )
  }

  handleRefresh = () => {
    this.load()
  }

  processColumns = columns => {
    // the method aims to hook the columns' sorter and filters to the
    // internal state of our component, so we can easily reset all of them

    const {
      params: { sorter, filters },
    } = this.state

    const { filters: propFilters, isMobileView } = this.props

    // filter out columns that should be hidden on mobile
    this.columns = isMobileView ? columns.filter(column => column.mobile !== false) : columns

    // filter columns based on hidden prop
    this.columns = this.columns.filter(column => column.hidden !== true)

    this.columns = this.columns.map(column => {
      if (!sorter) {
        column.sortOrder = null
      } else if (column.dataIndex === sorter.field) {
        column.sortOrder = `${sorter.order.toLowerCase()}end` // ascend / descend
      }

      if (filters && filters[column.dataIndex]) {
        column.filteredValue = filters[column.dataIndex]
      } else {
        column.filteredValue = null
      }

      // if a filter has been set via props, prevent user from changing it
      if (propFilters && propFilters[column.dataIndex]) {
        column.filters = null
      }

      return column
    })
  }

  render() {
    const {
      params: { page, limit, search },
    } = this.state
    const {
      dataSource: { data, loading, pagination },
      actions,
      rowDoubleClick,
      columns,
      ...rest
    } = this.props

    this.processColumns(columns)

    const extra = (
      <Row type="flex" justify="space-between">
        <Col xs={24} sm={8}>
          <Input.Search
            placeholder="Search..."
            onSearch={this.handleSearch}
            value={search}
            onChange={this.handleSearchInputChange}
            className="mb-4"
          />
        </Col>
        <Col>
          <Tooltip placement="top" title="Clear all filters">
            <Button icon="stop" className="mb-4" onClick={this.handleClearFilters} />
          </Tooltip>
          <Tooltip placement="top" title="Reload using current filters">
            <Button type="primary" icon="reload" className="ml-2 mb-4" onClick={this.handleRefresh}>
              Refresh
            </Button>
          </Tooltip>
          {actions}
        </Col>
      </Row>
    )

    return (
      <div>
        {extra}

        <Table
          rowKey="id"
          className="utils__scrollTable"
          columns={this.columns}
          dataSource={data}
          onChange={this.handleTableChange}
          loading={loading}
          pagination={{
            showLessItems: true,
            showQuickJumper: true,
            current: page,
            defaultPageSize: limit,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50', '100', '200'],
            total: pagination && pagination.total,
          }}
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: event => {
                if (rowDoubleClick) {
                  rowDoubleClick(record, rowIndex, event)
                }
              },
            }
          }}
          {...rest}
        />
      </div>
    )
  }
}

export default DataTable
