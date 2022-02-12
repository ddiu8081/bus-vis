import { ScatterplotLayer, IconLayer, TextLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import type { Layer } from '@deck.gl/core'

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
    const visibleZoomMap = {

    }
    return [
      new ScatterplotLayer<DrawStopItem>({
        id: 'scatter_stop-low_icons',
        data: this.props.data,
        pickable: false,
        getPosition: d => convertLocation(d.location),
        getRadius: d => 5,
        getFillColor: d => [51, 51, 51],
        getLineColor: d => [255, 255, 255],
        stroked: true,
        filled: true,
        radiusScale: 10,
        radiusMinPixels: 4,
        radiusMaxPixels: 8,
        lineWidthMinPixels: 2,
      }),
      new IconLayer<DrawStopItem>({
        id: 'scatter_stop-high_icons',
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
        getSize: 13,
        getTextAnchor: 'start',
        getPixelOffset: [12, 0],
        fontSettings: {
          sdf: true,
        }
      }),
    ]
  }
  filterSubLayer({layer, viewport}: {layer: Layer<any>, viewport: any}) {
    if (viewport.zoom < 10) {
      return false
    } else if (viewport.zoom < 12) {
      return layer.id === 'scatter_stop-low_icons'
    } else {
      return layer.id !== 'scatter_stop-low_icons'
    }
  }
}
ScatterStopLayer.layerName = 'ScatterStopLayer'
ScatterStopLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default ScatterStopLayer