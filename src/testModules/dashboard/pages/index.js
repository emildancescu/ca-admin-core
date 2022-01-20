import React from 'react'
import { Card, Button } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { Form, setDynamicRoles } from 'lib'

import TableFix from './tableSortFix'
// import RemoteSelectUsers from './remoteSelectUsers'

@connect()
class Dashboard extends React.Component {
  onSubmit = values => {
    console.log(values)
  }

  onChange = (field, values) => {
    console.log('changed value', field, values[field])
  }

  handleAddDynamicRole = () => {
    const { dispatch } = this.props

    dispatch(setDynamicRoles([{ name: 'dynamic-role' }]))
  }

  render() {
    const config = [
      {
        label: 'Input',
        field: 'input',
        placeholder: 'Input text',
      },
      {
        label: 'Date',
        field: 'date',
        type: 'date',
        placeholder: 'Select date',
      },
      {
        label: 'QR Scanner',
        field: 'scan',
        type: 'qrcode',
        placeholder: 'Scan QR',
      },
      {
        label: 'Select',
        field: 'select',
        type: 'select',
        placeholder: '- select option -',
        options: ['Option 1', 'Option 2'],
      },
      {
        label: 'File',
        field: 'file',
        type: 'file',
        placeholder: 'Select file',
        action: 'http://conceptapps.ddns.net:3001/upload',
        method: 'POST', // default, optional
        showUploadList: true, // default, optional
        listType: 'picture', // default: text, optional
        data: { extra: 'test param' }, // optional
        multiple: true, // default: false, optional
      },
      {
        label: 'TimePicker',
        field: 'timePicker',
        type: 'time',
        antdProps: {
          minuteStep: 15,
          // Defaults to 'HH:mm:ss'
          // This also controls what the panel shows.
          // Below example disables seconds panel
          format: 'HH:mm',
        },
      },
      {
        type: 'custom',
        label: 'Custom',
        field: 'custom-1',
        render: () => 'Just a text',
      },
      {
        label: 'Custom nested',
        field: 'custom',
        items: [
          {
            field: 'input-text',
            placeholder: 'Input text',
          },
          {
            type: 'custom',
            field: 'custom-2',
            render: () => 'Just another text',
          },
        ],
      },
      {
        label: 'Autocomplete',
        field: 'autocomplete',
        type: 'autocomplete',
        placeholder: 'Type to autocomplete',
        dataSource: ['ala', 'bala', 'porto', 'cala'],
      },
    ]

    const initialValues = {
      input: 0,
      timePicker: '20:00:00',
    }

    return (
      <>
        <Helmet title="Dashboard" />

        <Card title={<strong>DASHBOARD</strong>}>Welcome!</Card>

        <Card
          title={
            <strong className="text-uppercase">
              <FormattedMessage id="dashboard.form.title" defaultMessage="Example form" />
            </strong>
          }
          className="mt-4"
        >
          <Form
            config={config}
            onSubmit={this.onSubmit}
            onChange={this.onChange}
            values={initialValues}
          />
        </Card>

        {/* <Card className="mt-4" title={<strong className="text-uppercase">Remote select</strong>}>
          <RemoteSelectUsers />
        </Card> */}

        <Card className="mt-4 mb-4" title={<strong className="text-uppercase">Modals</strong>}>
          <div className="mb-5" style={{ textAlign: 'center' }}>
            <Link
              to={{ pathname: `/modalJumpTab`, state: { modal: true } }}
              className="utils__link--underlined"
            >
              modalJumpTab simple
            </Link>
            <br />
            <Link
              to={{ pathname: `/modalJumpTab`, state: { modal: true, selectedTab: 'edit' } }}
              className="utils__link--underlined"
            >
              modalJumpTab with state
            </Link>
          </div>
        </Card>

        <TableFix />

        <Card className="mt-4" title={<strong className="text-uppercase">Permissions</strong>}>
          <Button onClick={this.handleAddDynamicRole}>Add dynamic role</Button>
        </Card>
      </>
    )
  }
}

export default Dashboard
