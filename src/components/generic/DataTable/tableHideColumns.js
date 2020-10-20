import { v4 as uuidv4 } from 'uuid'
import React from 'react'
import { Switch, Button, Popover } from 'antd'
import isEqual from 'lodash/isEqual'

export default class TableHideColumns extends React.Component {
  state = {
    switches: {},
  }

  componentDidMount() {
    const { columns } = this.props
    this.propColumnsToState(columns)
  }

  componentDidUpdate(prevState, prevProps, snapshot) {
    const { columns } = this.props
    if (snapshot.notifyRequired) {
      this.propColumnsToState(columns)
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { columns } = this.props
    return { notifyRequired: !isEqual(prevProps.columns, columns) }
  }

  propColumnsToState = columns => {
    const colSettings = {}

    columns.forEach(el => {
      colSettings[el.dataIndex] = !el.hidden
    })

    this.setState(prevState => {
      return {
        switches: {
          ...colSettings,
          ...prevState.switches,
        },
      }
    })
  }

  handleOnChange = (checked, event, dataIndex) => {
    const { setHiddenColumns } = this.props

    this.setState(prevState => {
      const result = {
        ...prevState.switches,
        [dataIndex]: checked,
      }

      setHiddenColumns(result)

      return {
        switches: result,
      }
    })
  }

  render() {
    const { columns, className } = this.props

    const { switches } = this.state

    const settings = (
      <div style={{ width: 150 }}>
        {columns.length > 0
          ? columns.map(el => {
              return (
                <div key={uuidv4()} className="mb-2">
                  <Switch
                    className="mr-3"
                    checked={switches[el.dataIndex]}
                    onChange={(checked, event) => this.handleOnChange(checked, event, el.dataIndex)}
                  />
                  {el.title}
                </div>
              )
            })
          : 'No columns selected'}
      </div>
    )

    return (
      <Popover placement="bottomRight" trigger="click" content={settings}>
        <Button className={className} icon="table" />
      </Popover>
    )
  }
}
