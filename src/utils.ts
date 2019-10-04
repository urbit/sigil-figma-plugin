import ob from 'urbit-ob'

const compose = (...fs:Function[]) => {
  return fs.reduceRight((f, g) => (...args:any[]) => g(f(...args)), (v:any[]) => v)
}

const randInt = (max:number) => Math.floor(Math.random() * Math.floor(max));

const noSig = (str:String) => str.replace(/~+/g, '');

const sequence = (num:number) => Array.from(Array(num), (_, i) => i);

const SHIP_TYPES = {
  COMET: 'COMET',
  MOON: 'MOON',
  PLANET: 'PLANET',
  STAR: 'STAR',
  GALAXY: 'GALAXY',
}

const randShip = (k:string) => {
  let b = 8;
  if (k === SHIP_TYPES.COMET) b = 128;
  if (k === SHIP_TYPES.MOON) b = 64;
  if (k === SHIP_TYPES.PLANET) b = 32;
  if (k === SHIP_TYPES.STAR) b = 16;
  if (k === SHIP_TYPES.GALAXY) b = 8;
  return randInt(Math.pow(2, b) - 1);
}

const randomShip = (classOf:string) => {
  return compose(noSig, ob.patp, randShip)(classOf);
};

export {
  SHIP_TYPES,
  compose,
  randInt,
  noSig,
  sequence,
  randShip,
  randomShip
}
