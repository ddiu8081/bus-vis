import { PathLayer, ScatterplotLayer, IconLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import type { Layer } from '@deck.gl/core'

import { convertLocation } from '../mapUtil'
import ScatterStopLayer from './ScatterStopLayer'

interface SingleLineViewLayerProps {
  id: string
  visible: boolean
  data: LineData | undefined
}

class SingleLineViewLayer extends CompositeLayer<LineData, SingleLineViewLayerProps> {
  renderLayers() {
    const ICON_MAPPING = {
      marker: {x: 0, y: 48, width: 24, height: 24},
      marker2: {x: 0, y: 0, width: 48, height: 48},
    }
    return [
      new PathLayer<[number, number][]>({
        id: 'single_line-path',
        data: this.props.data?.path ? [this.props.data.path] : [],
        pickable: false,
        autoHighlight: false,
        widthScale: 15,
        widthMinPixels: 2,
        widthMaxPixels: 5,
        capRounded: true,
        jointRounded: true,
        getPath: d => d,
        getColor: [60, 10, 10, 100],
        getWidth: 10,
      }),
      new ScatterplotLayer<DrawStopItem>({
        id: `single_line-low_icons`,
        data: this.props.data ? this.props.data.busstops : [],
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
      new ScatterStopLayer({
        id: 'single_line-high_icons',
        visible: this.props.visible,
        data: this.props.data ? this.props.data.busstops : [],
      }),
    ]
  }
  filterSubLayer({layer, viewport}: {layer: Layer<any>, viewport: any}) {
    if (viewport.zoom < 10) {
      return layer.id === 'single_line-path'
    } else if (viewport.zoom < 12) {
      return layer.id !== 'single_line-high_icons'
    } else {
      return layer.id !== 'single_line-low_icons'
    }
  }
}
SingleLineViewLayer.layerName = 'SingleLineViewLayer'
SingleLineViewLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default SingleLineViewLayer