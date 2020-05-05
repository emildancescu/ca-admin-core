import React, { Component } from 'react'
import { Admin } from 'lib'
import testModules from 'testModules'

export default class App extends Component {
  render() {
    return <Admin title="CA Admin Core" modules={testModules} />
  }
}
