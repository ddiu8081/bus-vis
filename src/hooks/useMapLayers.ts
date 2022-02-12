import { useState } from 'react'
import { gen_layer_allLine, gen_layer_stopDetail, gen_layer_lineDetail } from '../interactors/mapLayers'
import type { Props_AllLine, Props_StopDetail, Props_LineDetail } from '../interactors/mapLayers'
import type { Layer } from 'deck.gl'

interface UpdateLayerConf {
  allLine?: Partial<Props_AllLine>
  stopDetail?: Partial<Props_StopDetail>
  lineDetail?: Partial<Props_LineDetail>
}

function useMapLayers(): [Layer<any>[], (props: UpdateLayerConf) => void] {
  const [mapLayers, setMapLayers] = useState<Layer<any>[]>([])
  const [allLineProp, setAllLineProp] = useState<Props_AllLine>({
    visible: true,
    data: [],
    foreground: [0, 0, 0, 100],
  })
  const [stopDetailProp, setStopDetailProp] = useState<Props_StopDetail>({
    visible: false,
    data: undefined,
    foreground: [0, 0, 0, 100],
  })
  const [lineDetailProp, setLineDetailProp] = useState<Props_LineDetail>({
    visible: false,
    data: undefined,
    foreground: [0, 0, 0, 100],
  })

  // update layer settings, return new layer array.
  // https://deck.gl/docs/developer-guide/using-layers
  const updateLayerSetting = (props: UpdateLayerConf) => {
    // Merge into a complete configuration.
    const mergedProps = {
      allLine: {
        ...allLineProp,
        ...props.allLine,
      },
      stopDetail: {
        ...stopDetailProp,
        ...props.stopDetail,
      },
      lineDetail: {
        ...lineDetailProp,
        ...props.lineDetail,
      },
    }
    setAllLineProp(mergedProps.allLine)
    setStopDetailProp(mergedProps.stopDetail)
    setLineDetailProp(mergedProps.lineDetail)
    // Generate new layers.
    const allLineLayer = gen_layer_allLine(mergedProps.allLine)
    const stopDetailLayer = gen_layer_stopDetail(mergedProps.stopDetail)
    const lineDetailLayer = gen_layer_lineDetail(mergedProps.lineDetail)
    setMapLayers([allLineLayer, stopDetailLayer, lineDetailLayer])
  }

  return [mapLayers, updateLayerSetting]
}

export default useMapLayers