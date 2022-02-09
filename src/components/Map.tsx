import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { StaticMap } from 'react-map-gl'

import DeckGL from '@deck.gl/react'
import { PickInfo } from 'deck.gl'
import { ViewStateProps } from '@deck.gl/core/lib/deck'
import { PathLayer } from '@deck.gl/layers'

import store from '../stores/App.store'
import dataSet from '../data/dataList'
import { generateViewStateOptions, getAndParseData } from '../interactors/mapUtil'
import { layer_allLine } from '../interactors/mapLayers'
import Tooltip from './Tooltip'

export interface Props {
  setLoading: (loading: boolean) => void
  currentCity: CityItem
}

const Component = (props: Props) => {
  const currentHighlight = useRecoilValue(store.currentHighlight)
  const globalStyle = useRecoilValue(store.globalStyle)
  const [initialState, setInitialState] = useState<ViewStateProps | undefined>(undefined)
  const [mapLayers, setMapLayers] = useState<any[]>([])
  const [allLineData, setAllLineData] = useState<DrawLineItem[]>([])
  const [hoverPickInfo, setHoverPickInfo] = useState<PickInfo<DrawLineItem> | null>(null)
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    setInitialState(generateViewStateOptions(props.currentCity.location, 9))
    loadData(props.currentCity.id)
  }, [props.currentCity])

  useEffect(() => {
    if (currentHighlight?.stop_data) {
      setInitialState(generateViewStateOptions(currentHighlight?.stop_data.location, 14, 1000)) 
    } else {
      setInitialState(generateViewStateOptions(props.currentCity.location, 9, 1000))
    }
  }, [currentHighlight])

  useEffect(() => {
    const layer = layer_allLine({
      data: allLineData,
      foreground: dataSet.mapStyleList[globalStyle].foreground, 
      onHover: d => setHoverPickInfo(d),
    })

    setMapLayers([layer])
  }, [globalStyle, allLineData])

  const loadData = async (cityId: string) => {
    props.setLoading(true)
    const totalPath = await getAndParseData(cityId)
    setAllLineData(totalPath)
    props.setLoading(false)
  }

  return (
    <div className="h-full w-full relative">
      <DeckGL
        initialViewState={initialState}
        controller={true}
        layers={mapLayers}
      >
        <Tooltip hoverPickInfo={hoverPickInfo} />
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={dataSet.mapStyleList[globalStyle].styleUrl} />
      </DeckGL>
    </div>
  )
}

export default Component
