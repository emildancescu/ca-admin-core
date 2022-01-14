import React from 'react'
import { Switch, Button, Popover, Tooltip } from 'antd'
import isObject from 'lodash/isObject'
import store from 'store'
import { injectIntl } from 'react-intl'

@injectIntl
export default class ColumnSelector extends React.Component {
  componentDidMount() {
    const { onColumnSelectionChanged, settingsKey, columns } = this.props

    // Check for settingsKey and localStorage settings
    // Apply once and send to parent <DataTable /> state
    if (settingsKey) {
      const tableSettings = store.get(`app.datatable.${settingsKey}`)

      if (tableSettings) {
        const columnSelectorSettings = tableSettings.columnSelector

        if (columnSelectorSettings && isObject(columnSelectorSettings)) {
          const result = {}
          let newColumns = [...columns]

          newColumns = newColumns.map(col => {
            const keyOrDataIndex = col.dataIndex || col.key
            if (columnSelectorSettings[keyOrDataIndex]) {
              col.hidden = columnSelectorSettings[keyOrDataIndex]
            }

            return col
          })

          newColumns.forEach(el => {
            const keyOrDataIndex = el.dataIndex || el.key
            result[keyOrDataIndex] = el.hidden
          })

          onColumnSelectionChanged(result)
        }
      }
    }
  }

  handleOnChange = (checked, event, dataIndex) => {
    const { onColumnSelectionChanged, settingsKey, columns } = this.props

    const result = {}

    columns.forEach(el => {
      const keyOrDataIndex = el.dataIndex || el.key
      result[keyOrDataIndex] = el.hidden
    })

    result[dataIndex] = !checked

    if (settingsKey) {
      store.set(`app.datatable.${settingsKey}`, {
        columnSelector: { ...result },
      })
    }

    onColumnSelectionChanged(result)
  }

  render() {
    let { columns } = this.props
    const { className, intl } = this.props

    // Filter columns based on 'excludeFromColumnSelector' prop
    columns = columns.filter(el => el.excludeFromColumnSelector !== true)

    const settings = (
      <div style={{ width: 200 }}>
        {columns.length > 0
          ? columns.map(el => {
              const keyOrDataIndex = el.dataIndex || el.key
              return (
                <div key={keyOrDataIndex} className="mb-2">
                  <Switch
                    className="mr-3"
                    checked={!el.hidden}
                    onChange={(checked, event) =>
                      this.handleOnChange(checked, event, keyOrDataIndex)
                    }
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
        <Tooltip placement="top" title={intl.formatMessage({ id: 'datatable.tooltips.columns' })}>
          <Button className={className} icon="table" />
        </Tooltip>
      </Popover>
    )
  }
}
