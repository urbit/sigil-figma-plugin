import { sigil, stringRenderer } from 'urbit-sigil-js'
import ob from 'urbit-ob'

figma.showUI(__html__)

figma.ui.onmessage = msg => {
  if (msg.type === 'create-sigil') {
    // Make a config for a sigil
    const config = {
      patp: msg.patp,
      renderer: stringRenderer,
      size: msg.size,
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


  if (msg.type === 'cancel') {
    figma.closePlugin()
  }
}
