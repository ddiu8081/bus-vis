import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { StaticMap } from 'react-map-gl'

import DeckGL from '@deck.gl/react'
import { PickInfo } from 'deck.gl'
import { ViewStateProps } from '@deck.gl/core/lib/deck'

import store from '../stores/App.store'
import dataSet from '../data/dataList'
import useMapLayers from '../hooks/useMapLayers'
import { generateViewStateOptions, getAndParseData } from '../interactors/mapUtil'
import Tooltip from './Tooltip'

export interface Props {
  setLoading: (loading: boolean) => void
  currentCity: CityItem
}

const Component = (props: Props) => {
  const currentHighlight = useRecoilValue(store.currentHighlight)
  const globalStyle = useRecoilValue(store.globalStyle)
  const [mapLayers, updateLayerSetting] = useMapLayers()
  const [initialState, setInitialState] = useState<ViewStateProps | undefined>(undefined)
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
      updateLayerSetting({
        allLine: {
          visible: false,
        },
        stopDetail: {
          visible: true,
          data: currentHighlight.stop_data,
          foreground: dataSet.mapStyleList[globalStyle].foreground,
        },
      })
    } else if (currentHighlight?.line_data) {
      setInitialState(generateViewStateOptions(props.currentCity.location, 12, 1000))
      updateLayerSetting({
        allLine: {
          visible: false,
        },
        stopDetail: {
          visible: false,
        },
        lineDetail: {
          visible: true,
          data: currentHighlight.line_data,
          foreground: dataSet.mapStyleList[globalStyle].foreground,
        },
      })
    } else {
      updateLayerSetting({
        allLine: {
          visible: true,
        },
        stopDetail: {
          visible: false,
        },
        lineDetail: {
          visible: false,
        },
      })
      setInitialState(generateViewStateOptions(props.currentCity.location, 9, 1000))
    }
  }, [currentHighlight])

  useEffect(() => {
    updateLayerSetting({
      allLine: {
        foreground: dataSet.mapStyleList[globalStyle].foreground, 
      },
      stopDetail: {
        foreground: dataSet.mapStyleList[globalStyle].foreground,
      },
      lineDetail: {
        foreground: dataSet.mapStyleList[globalStyle].foreground,
      },
    })
  }, [globalStyle])

  useEffect(() => {
    updateLayerSetting({
      allLine: {
        visible: true,
        data: allLineData,
        foreground: dataSet.mapStyleList[globalStyle].foreground, 
        onHover: (d: PickInfo<DrawLineItem>) => setHoverPickInfo(d),
      },
    })
  }, [allLineData])

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
