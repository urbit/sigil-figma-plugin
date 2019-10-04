import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Dropdown from 'react-dropdown'

import { sigil, reactRenderer } from 'urbit-sigil-js'
import ob from 'urbit-ob'
import './figma-plugin-ds.css'
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
  inverted:boolean,
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
    inverted:false,
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
      inverted: !this.state.inverted,
      colors: this.state.colors.reverse()
    })
  }

  onInputChange = (
    key:'patp'|'size'|'classOf'|'margin',
    e:React.ChangeEvent<HTMLInputElement>
  ) => {
      e.preventDefault()
      this.setState({ [key]: e.target.value } as Pick<ComponentState, any>)
  }

  onSelect = (e) => {
    this.setState({ classOf: e.value })
  }

  render() {

    const options = [
      { value: SHIP_TYPES.PLANET, label: 'Planet' },
      { value: SHIP_TYPES.STAR, label: 'Star', },
      { value: SHIP_TYPES.GALAXY, label: 'Galaxy', },
    ]

    const defaultOption = options[0]

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
    <div style={{
      borderRadius:'2px',
      display:'flex',
      justifyContent:'center',
      backgroundColor:`${this.state.colors[0]}`,
      border: '1px solid rgba(0, 0, 0, 0.1'
    }}>
      {
        _sigil
      }
    </div>
    <div style={{display:'flex',alignItems:'center',position:'relative'}} className='mv1 input-wrapper'>
      <div style={{position:'absolute',top:'9px',zIndex:99,marginLeft:'8px'}} className='mr1 silver'>Ship:</div>
      <input
        className='input'
        style={{flex:'1',paddingLeft:'40px'}}
        onChange={(e) => this.onInputChange('patp', e)}
        value={this.state.patp} />

        <button
          style={{
            position:'absolute',
            right:'8px',
            zIndex:99,
            backgroundColor:'transparent',
            border:'0px solid rgba(0,0,0,0.0)',
            padding:'0px',
            outline:'none',
            textDecoration:'underline'
          }}
          className='pointer'
          id="random"
          onClick={this.onRandomShip}>
          Random
        </button>
    </div>

    <div style={{display:'flex',alignItems:'center',position:'relative'}} className='mv1 input-wrapper'>
      <div style={{position:'absolute',top:'9px',zIndex:99,marginLeft:'8px'}} className='mr1 silver'>Size:</div>
      <input
        className='input'
        style={{flex:'1',paddingLeft:'40px'}}
        onChange={(e) => this.onInputChange('size', e)}
        value={this.state.size}/>
    </div>

    <div className='mv1'>
      <Dropdown
        options={options}
        onChange={this.onSelect}
        value={this.state.classOf} />
      </div>

      <button
        onClick={this.onInvert}
        style={{backgroundColor:'transparent',border:'0px solid rgba(0,0,0,0.0)',padding:'0px',outline:'none'}} className='checkbox mv1'>
        <input
          className='checkbox__box'
          checked={this.state.inverted}
          type="checkbox"/>
        <label className="checkbox__label">Invert</label>
      </button>

      <div style={{ display:'flex', justifyContent:'space-between'}}>
        <button
          className='mv1 button button--secondary-destructive'
          onClick={this.onCancel}>
          Cancel
        </button>
        <button
          className='mv1 button button--primary'
          id="create"
          onClick={this.onCreate}>
          Insert
        </button>
      </div>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))
