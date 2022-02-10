import { PathLayer, IconLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import { convertLocation } from './mapUtil'
import type { RGBAColor, LayerInputHandler } from 'deck.gl'
import SingleStopViewLayer from './layers/SingleStopViewLayer'

interface Props_AllLine {
  visible: boolean
  data: DrawLineItem[]
  foreground: RGBAColor
  onHover: LayerInputHandler<DrawLineItem>
}

const gen_layer_allLine = (props: Props_AllLine) => {
  return new PathLayer<DrawLineItem>({
    id: 'all-line',
    visible: props.visible,
    data: props.data,
    pickable: true,
    autoHighlight: true,
    widthScale: 10,
    widthMinPixels: 1,
    widthMaxPixels: 3,
    jointRounded: true,
    getPath: d => d.path,
    getColor: props.foreground,
    getWidth: 10,
    onHover: props.onHover
  })
}

interface Props_StopDetail {
  visible: boolean
  data: StopData
  foreground: RGBAColor
}

const gen_layer_stopDetail = (props: Props_StopDetail) => {

  return new SingleStopViewLayer({
    id: 'stop-detail',
    visible: props.visible,
    data: props.data,
  })
}

export interface Props_AllLayerConf {
  allLine: Props_AllLine
  stopDetail: Props_StopDetail
}

const layerConf = (props: Props_AllLayerConf) => {
  const allLineLayer = gen_layer_allLine(props.allLine)
  const stopDetailLayer = gen_layer_stopDetail(props.stopDetail)
  return [allLineLayer, stopDetailLayer]
}

export {
  layerConf,
}