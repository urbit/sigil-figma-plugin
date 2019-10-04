import { sigil, stringRenderer } from 'urbit-sigil-js'
import ob from 'urbit-ob'

const compose = (...fs:Function[]) => {
  return fs.reduceRight((f, g) => (...args:any[]) => g(f(...args)), (v:any[]) => v)
}

const randInt = (max:number) => Math.floor(Math.random() * Math.floor(max));

const noSig = str => str.replace(/~+/g, '');

const sequence = num => Array.from(Array(num), (_, i) => i);

const SHIP_TYPES = {
  COMET: 'COMET',
  MOON: 'MOON',
  PLANET: 'PLANET',
  STAR: 'STAR',
  GALAXY: 'GALAXY',
}

const randShip = k => {
  let b = 8;
  if (k === SHIP_TYPES.COMET) b = 128;
  if (k === SHIP_TYPES.MOON) b = 64;
  if (k === SHIP_TYPES.PLANET) b = 32;
  if (k === SHIP_TYPES.STAR) b = 16;
  if (k === SHIP_TYPES.GALAXY) b = 8;
  return randInt(Math.pow(2, b) - 1);
}

const randomShip = (classOf) => {
  return compose(noSig, ob.patp, randShip)(classOf);
};

figma.showUI(__html__)

const State = {
  store: {
    patp: '~ridlur-figbud',
    size: 256,
    classOf: SHIP_TYPES.PLANET,
  },
  set: (entry:Object) => State.store = {...State.store,  ...entry}
};

figma.ui.onmessage = msg => {
  if (msg.type === 'create-sigil') {
    // Make a config for a sigil
    const config = {
      patp: State.store.patp,
      renderer: stringRenderer,
      size: State.store.size,
    }
    // Generate a figma node from a sigil SVG
    const node: FrameNode = figma.createNodeFromSvg(sigil(config))
    // add the node in the Figma canvas
    figma.currentPage.appendChild(node)
    // select the node
    figma.currentPage.selection = [node]
    // zoom the viewport to the node
    figma.viewport.scrollAndZoomIntoView([node])
  }

  if (msg.type === 'random-patp') {
    const randPatp = randomShip(State.store.classOf)
    State.set({ patp: randPatp })
  }


  if (msg.type === 'cancel') {
    figma.closePlugin()
  }
}
