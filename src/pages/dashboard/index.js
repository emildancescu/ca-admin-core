import React from 'react'
import { Card } from 'antd'
import { Helmet } from 'react-helmet'

class Dashboard extends React.Component {
  render() {
    return (
      <>
        <Helmet title="Dashboard" />
        <Card title={<strong>DASHBOARD</strong>}>Welcome!</Card>
      </>
    )
  }
}

export default Dashboard
