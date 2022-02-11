import { PathLayer, IconLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import { convertLocation } from '../mapUtil'

interface SingleLineViewLayerProps {
  id: string
  visible: boolean
  data: LineData | undefined
}

class SingleLineViewLayer extends CompositeLayer<LineData, SingleLineViewLayerProps> {
  renderLayers() {
    const ICON_MAPPING = {
      marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
    }
    return [
      new PathLayer<[number, number][]>({
        id: `${this.props.id}-lines`,
        data: this.props.data?.path ? [this.props.data.path] : [],
        pickable: false,
        autoHighlight: false,
        widthScale: 15,
        widthMinPixels: 2,
        widthMaxPixels: 5,
        jointRounded: true,
        getPath: d => d,
        getColor: [60, 10, 10, 100],
        getWidth: 10,
      }),
      new IconLayer<LineStopData>({
        id: `${this.props.id}-stop-icon`,
        data: this.props.data ? this.props.data.busstops : [],
        pickable: false,
        iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker',
        sizeScale: 15,
        getPosition: d => convertLocation(d.location),
        getSize: d => 5,
      }),
    ]
  }
}
SingleLineViewLayer.layerName = 'SingleLineViewLayer'

export default SingleLineViewLayer