import { ScatterplotLayer, IconLayer, TextLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import type { Layer } from '@deck.gl/core'

import { convertLocation } from '../mapUtil'
import dataSet from '../../data/dataList'

interface ScatterStopLayerProps {
  id: string
  visible: boolean
  data: DrawStopItem[]
  scatterColor?: [number, number, number]
  hideZoom?: number
  detailZoom?: number
  minPixels?: number
  showTextLayer?: boolean
}

class ScatterStopLayer extends CompositeLayer<DrawStopItem, ScatterStopLayerProps> {
  renderLayers() {
    const scatterColor: [number, number, number] = this.props.scatterColor ? this.props.scatterColor : [51, 51, 51]
    const minPixels = this.props.minPixels ? this.props.minPixels : 4
    const showTextLayer = this.props.showTextLayer !== undefined ? this.props.showTextLayer : true
    return [
      new ScatterplotLayer<DrawStopItem>({
        id: this.props.id + 'scatter_stop-low_icons',
        data: this.props.data,
        pickable: false,
        getPosition: d => convertLocation(d.location),
        getRadius: 5,
        getFillColor: scatterColor,
        getLineColor: [255, 255, 255],
        stroked: true,
        filled: true,
        radiusScale: 12,
        radiusMinPixels: minPixels,
        radiusMaxPixels: 6,
        lineWidthMinPixels: 1,
      }),
      new IconLayer<DrawStopItem>({
        id: this.props.id + 'scatter_stop-high_icons',
        data: this.props.data,
        pickable: true,
        iconAtlas: dataSet.mapIcon.spriteUrl,
        iconMapping: dataSet.mapIcon.iconMap,
        getIcon: d => 'stop_md',
        sizeScale: 1,
        getPosition: d => convertLocation(d.location),
        getSize: 16,
      }),
      showTextLayer && new TextLayer<DrawStopItem>({
        id: this.props.id + 'scatter_stop-text',
        data: this.props.data,
        characterSet: 'auto',
        pickable: true,
        fontWeight: 'bold',
        outlineWidth: 2,
        outlineColor: [255, 255, 255],
        getText: d => d.name,
        getPosition: d => convertLocation(d.location),
        getColor: scatterColor,
        getSize: 13,
        getTextAnchor: 'start',
        getPixelOffset: [12, 0],
        fontSettings: {
          sdf: true,
        },
      }),
    ]
  }
  filterSubLayer({layer, viewport}: {layer: Layer<any>, viewport: any}) {
    const props: any = layer.parent.props
    if (!props) {
      return false
    }
    const hideZoom = props.hideZoom ? props.hideZoom : 10
    const detailZoom = props.detailZoom ? props.detailZoom : 12
    if (viewport.zoom < hideZoom) {
      return false
    } else if (viewport.zoom < detailZoom) {
      return layer.id.indexOf('low_icons') !== -1
    } else {
      return layer.id.indexOf('low_icons') === -1
    }
  }
}
ScatterStopLayer.layerName = 'ScatterStopLayer'
ScatterStopLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default ScatterStopLayer