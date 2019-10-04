import './ui.css'

document.getElementById('random-patp').onclick = () => {
  parent.postMessage(
    { pluginMessage: { type: 'random-patp' } },
     '*'
   )
}

document.getElementById('create-sigil').onclick = () => {
const textbox = document.getElementById('urbitid');
  const patp = (<HTMLInputElement>textbox).value;
  parent.postMessage(
    { pluginMessage: { type: 'create-sigil', patp } },
   '*'
  )

}

document.getElementById('cancel').onclick = () => {
  parent.postMessage(
    { pluginMessage: { type: 'cancel' } },
    '*'
  )
}
