import React, { Component } from 'react'
import { Admin } from 'lib'
import testModules from 'testModules'
import ExtraTopBar from 'testModules/components/ExtraTopBar'

export default class App extends Component {
  render() {
    return (
      <Admin
        title="CA Admin Core"
        modules={testModules}
        topBarExtra={{
          component: ExtraTopBar,
          reduxStore({ user }) {
            return { user }
          },
        }}
      />
    )
  }
}
