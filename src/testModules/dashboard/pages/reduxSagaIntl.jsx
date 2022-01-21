import * as React from 'react'
import { Card, Button } from 'antd'
import { connect } from 'react-redux'
import { request } from '../redux/reduxSagaIntl/actions'

const ReduxSagaIntl = props => {
  const { dispatch } = props

  const handleOnClick = () => {
    console.log(`Triggered! ${Math.random() * Math.random()}`)
    dispatch(request({ rsintl: 'schimbate' }))
  }

  return (
    <Card title={<strong>Redux-saga intl</strong>}>
      <Button onClick={handleOnClick}>Trigger</Button>
    </Card>
  )
}

export default connect()(ReduxSagaIntl)
