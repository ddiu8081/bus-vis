import { PathLayer } from '@deck.gl/layers'
import type { RGBAColor, LayerInputHandler } from 'deck.gl'

import SingleStopViewLayer from './layers/SingleStopViewLayer'

export interface Props_AllLine {
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

export interface Props_StopDetail {
  visible: boolean
  data: StopData | undefined
  foreground: RGBAColor
}

const gen_layer_stopDetail = (props: Props_StopDetail) => {

  return new SingleStopViewLayer({
    id: 'stop-detail',
    visible: props.visible,
    data: props.data,
  })
}

export {
  gen_layer_allLine,
  gen_layer_stopDetail,
}