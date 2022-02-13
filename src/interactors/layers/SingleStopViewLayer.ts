import { IconLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'

import { convertLocation } from '../mapUtil'
import dataSet from '../../data/dataList'

import MultiLineLayer from './MultiLineLayer'

interface SingleStopViewLayerProps {
  id: string
  visible: boolean
  data: StopData | undefined
}

class SingleStopViewLayer extends CompositeLayer<StopData, SingleStopViewLayerProps> {
  renderLayers() {
    return [
      new MultiLineLayer({
        id: 'single_stop-stop_lines',
        data: this.props.data ? this.props.data.lines_detail: [],
        pickable: true,
        autoHighlight: true,
        widthScale: 20,
        widthMinPixels: 3,
        widthMaxPixels: 6,
        jointRounded: true,
        getPath: d => d.path,
        getColor: [60, 10, 10, 70],
        highlightColor: [99, 38, 38, 200],
        getWidth: 4,
      }),
      new IconLayer<StopData>({
        id: `${this.props.id}-stop-icon`,
        data: this.props.data ? [this.props.data] : [],
        pickable: false,
        iconAtlas: dataSet.mapIcon.spriteUrl,
        iconMapping: dataSet.mapIcon.iconMap,
        getIcon: d => 'stop_lg',
        sizeUnits: 'meters',
        sizeMinPixels: 28,
        sizeMaxPixels: 48,
        sizeScale: 16,
        getPosition: d => convertLocation(d.location),
        getSize: d => 24,
      }),
    ]
  }
}
SingleStopViewLayer.layerName = 'SingleStopViewLayer'
SingleStopViewLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default SingleStopViewLayer