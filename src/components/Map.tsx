import { useState, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { useSetRecoilState } from 'recoil'
import type { PickInfo } from 'deck.gl'

import store from '../stores/App.store'
import dataSet from '../data/dataList'
import useMapLayers from '../hooks/useMapLayers'
import useMapViewport from '../hooks/useMapViewport'
import { getAndParseData } from '../interactors/mapUtil'
import Tooltip from './Tooltip'

export interface Props {
  setLoading: (loading: boolean) => void
  currentCity: CityItem
}

const Component = (props: Props) => {
  const deckRef = useRef<DeckGL>(null)
  const currentHighlight = useRecoilValue(store.currentHighlight)
  const setCurrentHighlightQuery = useSetRecoilState(
    store.currentHighlightQuery
  )
  const globalStyle = useRecoilValue(store.globalStyle)
  const [mapLayers, updateLayerSetting] = useMapLayers()
  const [viewport, setViewport, fitBounds] = useMapViewport()
  const [allLineData, setAllLineData] = useState<DrawLineItem[]>([])
  const [hoverPickInfo, setHoverPickInfo] = useState<PickInfo<DrawLineItem> | null>(null)
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    setViewport({
      location: props.currentCity.location,
      zoom: 9,
    })
    loadData(props.currentCity.id)
  }, [props.currentCity])

  useEffect(() => {
    if (currentHighlight?.stop_data) {
      setViewport({
        location: currentHighlight?.stop_data.location,
        zoom: 13,
        duration: 800,
      })
      updateLayerSetting({
        allLine: {
          visible: false,
        },
        stopDetail: {
          visible: true,
          data: currentHighlight.stop_data,
          foreground: dataSet.mapStyleList[globalStyle].foreground,
        },
        lineDetail: {
          visible: false,
        }
      })
    } else if (currentHighlight?.line_data) {
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
      fitBounds(currentHighlight.line_data.bounds, 800)
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
      setViewport({
        location: props.currentCity.location,
        zoom: 9,
        duration: 1000,
      })
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
      },
    })
  }, [allLineData])

  const onHoverItem = (info: PickInfo<any>) => {
    if (!info.object) {
      setHoverPickInfo(null)
      return
    }
    setHoverPickInfo(info)
  }

  const onClickItem = (info: PickInfo<any>, event: any) => {
    if (!info.object) {
      return
    }
    handleClickLineObject(info)
  }

  const loadData = async (cityId: string) => {
    props.setLoading(true)
    const totalPath = await getAndParseData(cityId)
    setAllLineData(totalPath)
    props.setLoading(false)
  }

  const handleClickLineObject = (pickItem: PickInfo<DrawLineItem | DrawStopItem>) => {
    if (pickItem.object?.id) {
      const type = 'path' in pickItem.object ? 'line' : 'stop'
      setCurrentHighlightQuery({
        type: type,
        id: pickItem.object.id,
      }) 
    }
  }

  return (
    <div onContextMenu={(evt) => evt.preventDefault()} className="h-full w-full relative">
      <DeckGL
        ref={deckRef}
        pickingRadius={4}
        initialViewState={viewport}
        controller={true}
        layers={mapLayers}
        onHover={onHoverItem}
        onClick={onClickItem}
      >
        <Tooltip hoverPickInfo={hoverPickInfo} />
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={dataSet.mapStyleList[globalStyle].styleUrl} />
      </DeckGL>
    </div>
  )
}

export default Component
