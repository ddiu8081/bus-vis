import { IconLayer, TextLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'

import { convertLocation } from '../mapUtil'

interface ScatterStopLayerProps {
  id: string
  visible: boolean
  data: DrawStopItem[]
}

class ScatterStopLayer extends CompositeLayer<DrawStopItem, ScatterStopLayerProps> {
  renderLayers() {
    const ICON_MAPPING = {
      marker: {x: 0, y: 48, width: 24, height: 24},
      marker2: {x: 0, y: 0, width: 48, height: 48},
    }
    return [
      new IconLayer<DrawStopItem>({
        id: 'scatter_stop-icons',
        data: this.props.data,
        pickable: true,
        iconAtlas: 'https://cloud-upyun.ddiu.site/picture/2022/02/12/2Cia9o.png',
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker2',
        sizeScale: 1,
        getPosition: d => convertLocation(d.location),
        getSize: d => 16,
      }),
      new TextLayer<DrawStopItem>({
        id: 'scatter_stop-text',
        data: this.props.data,
        characterSet: 'auto',
        pickable: true,
        fontWeight: 'bold',
        outlineWidth: 2,
        outlineColor: [255, 255, 255],
        getText: d => d.name,
        getPosition: d => convertLocation(d.location),
        getColor: [51, 51, 51],
        getSize: 14,
        getTextAnchor: 'start',
        getPixelOffset: [12, 0],
        fontSettings: {
          sdf: true,
        }
      }),
    ]
  }
}
ScatterStopLayer.layerName = 'ScatterStopLayer'
ScatterStopLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default ScatterStopLayer