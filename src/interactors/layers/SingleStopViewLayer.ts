import { PathLayer, IconLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import { convertLocation } from '../mapUtil'

interface SingleStopViewLayerProps {
  id: string
  visible: boolean
  data: StopData | undefined
}

class SingleStopViewLayer extends CompositeLayer<StopData, SingleStopViewLayerProps> {
  renderLayers() {
    const ICON_MAPPING = {
      marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
    }
    return [
      new IconLayer<StopData>({
        id: `${this.props.id}-stop-icon`,
        data: this.props.data ? [this.props.data] : [],
        pickable: false,
        iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker',
        sizeScale: 15,
        getPosition: d => convertLocation(d.location),
        getSize: d => 5,
      }),
      new PathLayer<DrawLineItem>({
        id: `${this.props.id}-stop-lines`,
        data: this.props.data ? this.props.data.lines_detail: [],
        pickable: false,
        autoHighlight: false,
        widthScale: 15,
        widthMinPixels: 2,
        widthMaxPixels: 5,
        jointRounded: true,
        getPath: d => d.path,
        getColor: [60, 10, 10, 100],
        getWidth: 10,
      })
    ];
  }
}
SingleStopViewLayer.layerName = 'SingleStopViewLayer'

export default SingleStopViewLayer