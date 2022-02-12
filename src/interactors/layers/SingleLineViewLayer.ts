import { PathLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'

import ScatterStopLayer from './ScatterStopLayer'

interface SingleLineViewLayerProps {
  id: string
  visible: boolean
  data: LineData | undefined
}

class SingleLineViewLayer extends CompositeLayer<LineData, SingleLineViewLayerProps> {
  renderLayers() {
    return [
      new PathLayer<[number, number][]>({
        id: 'single_line-path',
        data: this.props.data?.path ? [this.props.data.path] : [],
        pickable: false,
        autoHighlight: false,
        widthScale: 15,
        widthMinPixels: 2,
        widthMaxPixels: 5,
        getPath: d => d,
        getColor: [136, 111, 111],
        getWidth: 10,
      }),
      new ScatterStopLayer({
        id: 'single_line-stops',
        visible: this.props.visible,
        data: this.props.data ? this.props.data.busstops : [],
      }),
    ]
  }
}
SingleLineViewLayer.layerName = 'SingleLineViewLayer'
SingleLineViewLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default SingleLineViewLayer