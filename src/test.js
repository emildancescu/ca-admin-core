import React from 'react'
import { Button } from 'antd'

const Card = () => {
  return (
    <div className="card">
      This is a custom card <Button>{process.env.REACT_APP_REDUX_LOGGER}</Button>
    </div>
  )
}

export default Card
