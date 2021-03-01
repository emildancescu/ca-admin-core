import React, { Component } from 'react'
import { Admin } from 'lib'
import testModules from 'testModules'

export default class App extends Component {
  render() {
    return <Admin title="CA Admin Core" modules={testModules} topBarComp={Parent} />
  }
}

// eslint-disable-next-line no-unused-vars
const Parent = () => (
  <>
    <Child />
    <Child2 />
    <Child3 />
  </>
)

const Child = () => <div className="mr-4">copchil</div>

const Child2 = () => <div className="mr-4">copchil 2</div>

class Child3 extends Component {
  render() {
    return <div className="mr-4">copchil 3</div>
  }
}
