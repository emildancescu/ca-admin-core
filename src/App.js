import React, { Component } from 'react'
import { Admin, Authorize } from 'lib'
import testModules from 'testModules'
import ExtraTopBar from 'testModules/components/ExtraTopBar'

const topBarExtra = (
  <Authorize roles={['admin']}>
    <ExtraTopBar />
  </Authorize>
)

export default class App extends Component {
  render() {
    return <Admin title="CA Admin Core" modules={testModules} topBarExtra={topBarExtra} />
  }
}
