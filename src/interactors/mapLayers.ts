import { PathLayer } from '@deck.gl/layers'
import { RGBAColor, LayerInputHandler } from 'deck.gl'

export interface Props_AllLine {
  data: DrawLineItem[]
  foreground: RGBAColor
  onHover: LayerInputHandler<DrawLineItem>
}

const layer_allLine = (props: Props_AllLine) => {
  return new PathLayer({
    id: 'allLineLayer',
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

export interface Props_AllLine {
  data: DrawLineItem[]
  foreground: RGBAColor
  onHover: LayerInputHandler<DrawLineItem>
}

const layer_allLine1 = (props: Props_AllLine) => {
  return new PathLayer({
    id: 'allLineLayer',
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

export {
  layer_allLine,
}