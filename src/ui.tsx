import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { sigil, reactRenderer } from 'urbit-sigil-js'
import './ui.css'

import {
  SHIP_TYPES,
  randomShip
} from './utils'


declare function require(path: string): any

interface MyProps {}

interface MyState {
  size:number,
  patp:string,
  classOf:string,
}


class App extends React.Component<MyProps, MyState> {
  constructor(props) {
  super(props)
  this.state = {
    size: 256,
    patp: 'ridlur-figbud',
    classOf: SHIP_TYPES.PLANET,
  };
};

  textbox: HTMLInputElement

  sizeRef = (element: HTMLInputElement) => {
    if (element) element.value = `${this.state.size}`
    this.textbox = element
  }

  onCreate = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'create-sigil',
        patp: this.state.patp,
        size: this.state.size
      }
    }, '*')
  }

  onCancel = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'cancel'
      }
    }, '*')
  }

  onRandomShip = () => {
    this.setState({
      patp: randomShip(this.state.classOf)
    })
  }

  onSetClassOf = (arg:string) => {
    this.setState({
      classOf: arg,
    })
  }

  render() {

    return <div>
      <p>Size: <input ref={this.sizeRef} /></p>

      {
        sigil({
          patp:this.state.patp,
          renderer:reactRenderer,
          size:128
        })
      }

      <button id="random" onClick={this.onRandomShip}>Random</button>

      <button id="setGalaxy" onClick={() =>
        this.onSetClassOf(SHIP_TYPES.GALAXY)}>Galaxy</button>

      <button id="setStar" onClick={() =>
        this.onSetClassOf(SHIP_TYPES.STAR)}>Star</button>

      <button id="setPlanet" onClick={() =>
        this.onSetClassOf(SHIP_TYPES.PLANET)}>Planet</button>

      <button id="create" onClick={this.onCreate}>Create</button>

      <button onClick={this.onCancel}>Cancel</button>

    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))
