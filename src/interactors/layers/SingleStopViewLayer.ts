import { PathLayer, IconLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'

import { convertLocation } from '../mapUtil'
import dataSet from '../../data/dataList'

interface SingleStopViewLayerProps {
  id: string
  visible: boolean
  data: StopData | undefined
}

class SingleStopViewLayer extends CompositeLayer<StopData, SingleStopViewLayerProps> {
  renderLayers() {
    return [
      new PathLayer<DrawLineItem>({
        id: 'single_stop-stop_lines',
        data: this.props.data ? this.props.data.lines_detail: [],
        pickable: true,
        autoHighlight: true,
        widthScale: 15,
        widthMinPixels: 2,
        widthMaxPixels: 4,
        getPath: d => d.path,
        getColor: [60, 10, 10, 50],
        getWidth: 10,
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