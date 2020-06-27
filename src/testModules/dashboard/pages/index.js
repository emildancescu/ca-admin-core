import React from 'react'
import { Card } from 'antd'
import { Helmet } from 'react-helmet'
import { Form } from 'lib'

class Dashboard extends React.Component {
  onSubmit = values => {
    console.log(values)
  }

  render() {
    const config = [
      {
        label: 'Input',
        field: 'input1',
        placeholder: 'Input text',
      },
      {
        label: 'Select',
        field: 'select1',
        type: 'select',
        placeholder: '- select option -',
        options: ['Option 1', 'Option 2'],
      },
      {
        label: 'File',
        field: 'file1',
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

        <Card title={<strong>FORM EXAMPLE</strong>} className="mt-4">
          <Form config={config} onSubmit={this.onSubmit} />
        </Card>
      </>
    )
  }
}

export default Dashboard
