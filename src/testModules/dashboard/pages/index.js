import React from 'react'
import { Card } from 'antd'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { Form } from 'lib'
import TableFix from './tableSortFix'
import RemoteSelectUsers from './remoteSelectUsers'

class Dashboard extends React.Component {
  onSubmit = values => {
    console.log(values)
  }

  onChange = (field, values) => {
    console.log('changed value', field, values[field])
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
    ]

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
          <RemoteSelectUsers className="mb-5" />
          <Form config={config} onSubmit={this.onSubmit} onChange={this.onChange} />
          <TableFix />
        </Card>
      </>
    )
  }
}

export default Dashboard
