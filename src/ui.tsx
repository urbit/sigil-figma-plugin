import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { sigil, reactRenderer } from 'urbit-sigil-js'
import ob from 'urbit-ob'
import './ui.css'

import {
  SHIP_TYPES,
  randomShip
} from './utils'


declare function require(path: string): any

interface ComponentProps {}

interface ComponentState {
  size:number,
  patp:string,
  classOf:string,
  colors:string[],
  err: {
    source:string,
    message:string,
  },
}

class App extends React.Component<ComponentProps, ComponentState> {
  constructor(props) {
  super(props)
  this.state = {
    size: 256,
    patp: '~ridlur-figbud',
    classOf: SHIP_TYPES.PLANET,
    colors: ['#FFF', '#000'],
    err: {
      source: '',
      message: '',
    },
  };
};

  onCreate = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'create-sigil',
        patp: this.state.patp,
        size: this.state.size,
        colors: this.state.colors,
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

  onInvert = () => {
    this.setState({
      colors: this.state.colors.reverse()
    })
  }

  onInputChange = (
    key:'patp'|'size'|'classOf'|'margin',
    e:React.ChangeEvent<HTMLInputElement>
  ) => {
      if (key === 'margin' && e.target.value === '') {
        // welp
        e.target.value = undefined
      }
      e.preventDefault()
      this.setState({ [key]: e.target.value } as Pick<ComponentState, any>)
  }

  render() {

    const _sigil = ob.isValidPatp(this.state.patp)
      ? sigil({
        patp:this.state.patp,
        renderer:reactRenderer,
        size:128,
        colors:this.state.colors
      })
      : <div
        style={{
          width:'128px',
          height:'128px',
          backgroundColor:'black'
        }}/>

    return <div style={{ display:'flex',flexDirection:'column' }}>
    <div style={{border:'1px solid silver'}}>
      {
        _sigil
      }
    </div>
    <div className='mv1'>
      Ship:
      <input
        onChange={(e) => this.onInputChange('patp', e)}
        value={this.state.patp} />
    </div>

    <div className='mv1'>
      Size:
      <input
        onChange={(e) => this.onInputChange('size', e)}
        value={this.state.size}/>
    </div>

      <select
        onChange={(e) => this.onSetClassOf(e.target.value)}
        name="classSelection"
        className="select-menu mv1">
        <option
          value={SHIP_TYPES.PLANET}
          selected={this.state.classOf === SHIP_TYPES.PLANET}>
          Planet
        </option>
        <option
          value={SHIP_TYPES.STAR}
          selected={this.state.classOf === SHIP_TYPES.STAR}>
          Star
        </option>
        <option
          value={SHIP_TYPES.GALAXY}
          selected={this.state.classOf === SHIP_TYPES.GALAXY}>
          Galaxy
        </option>
      </select>

      <button
        className='mv1'
        id="invert"
        onClick={this.onInvert}>
        Invert Color
      </button>

      <button
        className='mv1'
        id="random"
        onClick={this.onRandomShip}>
        Random
      </button>

      <button
        className='mv1'
        id="create"
        onClick={this.onCreate}>
        Insert
      </button>

      <button className='mv1' onClick={this.onCancel}>Cancel</button>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))
