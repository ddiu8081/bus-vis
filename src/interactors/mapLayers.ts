import { PathLayer } from '@deck.gl/layers'
import { hexToRgb } from './mapUtil'
import type { RGBAColor } from 'deck.gl'

import SingleStopViewLayer from './layers/SingleStopViewLayer'
import SingleLineViewLayer from './layers/SingleLineViewLayer'
import ScatterStopLayer from './layers/ScatterStopLayer'

export interface Props_AllLine {
  visible: boolean
  data: DrawLineItem[]
  foreground: RGBAColor
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
    getColor: d => {
      if (d.color?.length === 6) {
        const rgbArr = hexToRgb(d.color)
        return rgbArr ? [...rgbArr, 200] : props.foreground
      }
      return props.foreground
    },
    getWidth: 10,
  })
}

export interface Props_AllStop {
  visible: boolean
  data: DrawStopItem[]
  foreground: RGBAColor
}

const gen_layer_allStop = (props: Props_AllStop) => {
  return new ScatterStopLayer({
    id: 'all-stop',
    visible: props.visible,
    data: props.data,
    scatterColor: [192, 160, 128],
    hideZoom: 5,
    detailZoom: 13,
    minPixels: 2,
    showTextLayer: false
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

export interface Props_LineDetail {
  visible: boolean
  data: LineData | undefined
  foreground: RGBAColor
}

const gen_layer_lineDetail = (props: Props_LineDetail) => {
  return new SingleLineViewLayer({
    id: 'line-detail',
    visible: props.visible,
    data: props.data,
  })
}

export {
  gen_layer_allLine,
  gen_layer_allStop,
  gen_layer_stopDetail,
  gen_layer_lineDetail,
}