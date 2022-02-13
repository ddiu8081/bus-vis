import { PathLayer } from '@deck.gl/layers'

class MultiLineLayer extends PathLayer<DrawLineItem> {
  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:DECKGL_FILTER_SIZE': `
        if (!isVertexPicked(geometry.pickingColor)) {
          size = size / 2.0;
        }
      `,
    }
    return shaders
  }
}
MultiLineLayer.layerName = 'MultiLineLayer'
MultiLineLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default MultiLineLayer