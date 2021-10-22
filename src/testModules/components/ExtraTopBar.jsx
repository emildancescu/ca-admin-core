import * as React from 'react'
import { connect } from 'react-redux'

@connect(({ user }) => ({ user }))
class ExtraTopBar extends React.Component {
  componentDidMount() {
    // console.log('extra mounted')
  }

  render() {
    const { user } = this.props
    return <div>Extra: {user.name}</div>
  }
}

export default ExtraTopBar
