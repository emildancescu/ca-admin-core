/* eslint-disable no-unused-vars */
import { Button, Card } from 'antd'
import * as React from 'react'
import { connect } from 'react-redux'
import { load, cancel } from '../redux/with_cancel/actions'

import query_min from './query-min.png'

const mapStateToProps = ({ saga_with_cancel }) => ({ saga_with_cancel })

const Comp = props => {
  const {
    dispatch,
    saga_with_cancel: { data, loading },
  } = props

  return (
    <>
      <Card title="Request cancel">
        <Button size="large" type="primary" loading={loading} onClick={() => dispatch(load())}>
          Load
        </Button>

        <Button className="ml-4" size="large" type="danger" onClick={() => dispatch(cancel())}>
          Cancel
        </Button>

        <pre className="mt-4">{JSON.stringify(data, null, '\t')}</pre>
      </Card>

      <Card title="Query params" className="mt-4">
        <img src={query_min} alt="qp" />
      </Card>
    </>
  )
}

export default connect(mapStateToProps)(Comp)
