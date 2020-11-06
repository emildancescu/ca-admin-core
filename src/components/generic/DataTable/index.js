import React from 'react'
import { Table, Input, Row, Col, Button, Tooltip, Icon } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'
import RemoteFilter from './remoteFilter'
import ColumnSelector from './columnSelector'

@connect(({ settings: { isMobileView } }) => ({ isMobileView }))
class DataTable extends React.Component {
  state = {
    params: {
      search: '',
      page: 1,
      limit: 25, // default page size
    },
    columnSelector: {},
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
    if (sorter.field && sorter.order) {
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

  remoteFilterConfig = config => ({
    filterDropdown: ({ setSelectedKeys, confirm }) => (
      <div style={config.styleColumn ? { ...config.styleColumn } : { padding: 8, width: '200px' }}>
        <RemoteFilter
          remoteSearch={config}
          tableDropdownFn={{
            setSelectedKeys,
            confirm,
          }}
        />
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="filter" theme="filled" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  })

  processColumns = columns => {
    // the method aims to hook the columns' sorter and filters to the
    // internal state of our component, so we can easily reset all of them

    const {
      params: { sorter, filters },
      columnSelector,
    } = this.state

    const { filters: propFilters, isMobileView } = this.props

    const processedColumns = columns.map(column => {
      // Set hidden attribute by default. Avoid using 'undefined' type
      if (column.hidden !== true) {
        column.hidden = false
      }

      // filter out columns that should be hidden on mobile
      // Will be overwritten by <ColumnSelector  /> if enabled
      if (column.mobile === false && isMobileView) {
        column.hidden = true
      }

      return column
    })

    // Need to make copies of 'processedColumns' to not loose columns
    // For <Table /> we use 'columnsForTable'
    // For <ColumnSelector  /> we use 'processedColumns'

    let columnsForTable = [...processedColumns]

    // columnSelector - Correct hidden attribute by state
    if (Object.keys(columnSelector).length > 0) {
      columnsForTable = columnsForTable.map(column => {
        const lookup = column.dataIndex || column.key

        if (columnSelector[lookup] !== undefined) {
          column.hidden = columnSelector[lookup]
        }

        return column
      })
    }

    // Filter and map <Table /> columns based on hidden prop
    columnsForTable = columnsForTable.filter(column => column.hidden === false)

    columnsForTable = columnsForTable.map(column => {
      if (!sorter) {
        column.sortOrder = false
      }

      if (sorter && column.dataIndex === sorter.field) {
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

      if (column.remoteFilter) {
        column = {
          ...column,
          ...this.remoteFilterConfig(column.remoteFilter),
        }
      }

      return column
    })

    // Return both arrays of columns
    return [processedColumns, columnsForTable]
  }

  // Event for <ColumnSelector />
  onColumnSelectionChanged = columns => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        columnSelector: {
          ...prevState.columnSelector,
          ...columns,
        },
      }

      return newState
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
      showColumnSelector,
      settingsKey,
      ...rest
    } = this.props

    const [columnsForColumnSelector, columnsForTable] = this.processColumns(columns)

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
          {showColumnSelector && (
            <ColumnSelector
              onColumnSelectionChanged={this.onColumnSelectionChanged}
              className="mr-2"
              columns={columnsForColumnSelector}
              settingsKey={settingsKey}
            />
          )}
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
          key={columns.length}
          rowKey="id"
          className="utils__scrollTable"
          columns={columnsForTable}
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
