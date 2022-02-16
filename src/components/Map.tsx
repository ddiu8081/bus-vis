import { useState, useEffect, useRef } from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import type { PickInfo } from 'deck.gl'

import store from '../stores/App.store'
import dataSet from '../data/dataList'
import useMapLayers from '../hooks/useMapLayers'
import useMapViewport from '../hooks/useMapViewport'
import { getAndParseLineData, getAndParseStopData } from '../interactors/mapUtil'
import Tooltip from './Tooltip'

export interface Props {
  setLoading: (loading: boolean) => void
  currentCity: CityItem
}

const Component = (props: Props) => {
  const deckRef = useRef<DeckGL>(null)
  const [currentHighlight, setCurrentHighlight] = useRecoilState(store.currentHighlight)
  const setCurrentHighlightQuery = useSetRecoilState(
    store.currentHighlightQuery
  )
  const globalStyle = useRecoilValue(store.globalStyle)
  const mapView = useRecoilValue(store.mapView)
  const [mapLayers, updateLayerSetting] = useMapLayers()
  const [viewport, setViewport, fitBounds] = useMapViewport()
  const [allLineData, setAllLineData] = useState<DrawLineItem[]>([])
  const [allStopData, setAllStopData] = useState<DrawStopItem[]>([])
  const [hoverPickInfo, setHoverPickInfo] = useState<PickInfo<DrawLineItem> | null>(null)
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    setViewport({
      location: props.currentCity.location,
      zoom: 9,
    })
    loadData(mapView, props.currentCity.id)
  }, [props.currentCity])

  useEffect(() => {
    loadData(mapView, props.currentCity.id)
  }, [mapView])

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
        allStop: {
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
        allStop: {
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
          visible: mapView === 'line',
        },
        allStop: {
          visible: mapView === 'stop',
        },
        stopDetail: {
          visible: false,
        },
        lineDetail: {
          visible: false,
        },
      })
      if (viewport?.longitude && viewport?.latitude && viewport.zoom) {
        setViewport({
          location: [viewport.longitude, viewport.latitude],
          zoom: viewport.zoom - 0.5,
          duration: 300,
        }) 
      }
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
      allStop: {
        visible: false,
      },
    })
  }, [allLineData])

  useEffect(() => {
    updateLayerSetting({
      allStop: {
        visible: true,
        data: allStopData,
        foreground: dataSet.mapStyleList[globalStyle].foreground,
      },
      allLine: {
        visible: false,
      },
    })
  }, [allStopData])

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
    handleClickObject(info)
  }

  const loadData = async (type: string,  cityId: string) => {
    props.setLoading(true)
    if (type === 'line') {
      const totalPath = await getAndParseLineData(cityId)
      setAllLineData(totalPath)
    } else if (type === 'stop') {
      const totalStop = await getAndParseStopData(cityId)
      setAllStopData(totalStop)
    }
    setCurrentHighlightQuery(null)
    setCurrentHighlight(null)
    props.setLoading(false)
  }

  const handleClickObject = (pickItem: PickInfo<DrawLineItem | DrawStopItem>) => {
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
        getCursor={() => hoverPickInfo ? 'pointer' : 'default'}
      >
        <Tooltip hoverPickInfo={hoverPickInfo} />
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={dataSet.mapStyleList[globalStyle].styleUrl} />
      </DeckGL>
    </div>
  )
}

export default Component
