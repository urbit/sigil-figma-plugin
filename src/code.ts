import { sigil, stringRenderer } from 'urbit-sigil-js'

figma.showUI(__html__, {width: 240, height: 490})

figma.ui.onmessage = msg => {
  if (msg.type === 'create-sigil') {

    // Make a config for a sigil
    const config = {
      patp: msg.patp,
      renderer: stringRenderer,
      size: msg.size,
      colors: msg.colors,
    }

    // Generate a figma node from a sigil SVG
    const node: FrameNode = figma.createNodeFromSvg(sigil(config))

    // Set the new node's x and y to the center of the current viewport
    node.x = figma.viewport.center.x
    node.y = figma.viewport.center.y

    // Name the node after the patp
    node.name = msg.patp

    // Add the node in the Figma canvas
    figma.currentPage.appendChild(node)

    // Select the node
    figma.currentPage.selection = [node]
  }


  if (msg.type === 'cancel') {
    figma.closePlugin()
  }
}
