import { useState, useEffect, useRef } from 'react'
import React from 'react'
import ky from 'ky'
import gcoord from 'gcoord'
import md5 from 'js-md5'

import DeckGL from '@deck.gl/react'
import { FlyToInterpolator, PickInfo } from 'deck.gl'
import { StaticMap } from 'react-map-gl'
import { ViewStateProps } from '@deck.gl/core/lib/deck'
import { PathLayer } from '@deck.gl/layers'

import Tooltip from './Tooltip'

export interface Props {
  setLoading: (loading: boolean) => void
  currentCity: CityItem
  mapStyle: MapStyleItem
}

const Component = (props: Props) => {
  const [initialState, setInitialState] = useState<ViewStateProps | undefined>(undefined)
  const [layers, setLayers] = useState<any[]>([])
  const [allLineData, setAllLineData] = useState<DrawLineItem[]>([])
  const [hoverPickInfo, setHoverPickInfo] = useState<PickInfo<DrawLineItem> | null>(null)

  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    setInitialState({
      longitude: props.currentCity.location[0],
      latitude: props.currentCity.location[1],
      zoom: 9,
      pitch: 0,
      bearing: 0,
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
    })
    loadData(props.currentCity.id)
  }, [props.currentCity])

  useEffect(() => {
    const layer = new PathLayer({
      id: 'allLineLayer',
      data: allLineData,
      pickable: true,
      autoHighlight: true,
      widthScale: 10,
      widthMinPixels: 1,
      widthMaxPixels: 3,
      jointRounded: true,
      getPath: d => d.path,
      getColor: props.mapStyle.foreground,
      getWidth: 10,
      onHover: d => setHoverPickInfo(d)
    })

    setLayers([layer])
  }, [props.mapStyle, allLineData])

  const decryptText = (encryptedText: string): string => {
    let newTextArr = encryptedText.split('').reverse()
    newTextArr = newTextArr.map(char => {
      const charCode = char.charCodeAt(0)
      return String.fromCharCode(charCode - 1)
    })
    const newText = newTextArr.join('')
    const decodedText = decodeURIComponent(escape(window.atob(newText)))
    return decodedText
  }

  const parseLineData = (lineData: string): string[] => {
    const lineDataArr = lineData.split('|').map(x => decryptText(x))
    return lineDataArr
  }

  const generateDownloadUrl = (secret: string, path: string) => {
    const host = import.meta.env.VITE_CDN_HOST
    const timestampHex = Math.floor(Date.now() / 1000).toString(16)
    const md5Hash = md5(secret + path + timestampHex)
    return `${host}/${md5Hash}/${timestampHex}${path}`
  }

  const loadData = async (cityId: string) => {
    props.setLoading(true)
    const requestPath = `/data/line/${cityId}.data`
    const requestSecret = import.meta.env.VITE_CDN_VERIFY_SECRET
    const url = generateDownloadUrl(requestSecret, requestPath)
    const data_line = await ky.get(url).text()
    const parsed = parseLineData(data_line)
    if (parsed) {
      const totalPath: DrawLineItem[] = []
      for (let i = 0; i < parsed.length; i++) {
        const line_str = parsed[i]
        const points = line_str.split(';').map(p => p.split(','))
        let lineId = ''
        let lineName = ''
        let last_blng = 0
        let last_blat = 0
        let currentPath: [number, number][] = []
        for (let j = 0; j < points.length; j++) {
          const point = points[j]
          if (j == 0 && point.length === 2) {
            lineId = point[0]
            lineName = point[1]
            continue
          }
          const blng = parseInt(point[0]) + last_blng
          const blat = parseInt(point[1]) + last_blat
          last_blng = blng
          last_blat = blat
          if (blng && blat) {
            currentPath.push(
              gcoord.transform(
                [blng / 1000000, blat / 1000000],
                gcoord.GCJ02,
                gcoord.WGS84
              )
            )
          }
        }
        totalPath.push({
          id: lineId,
          name: lineName,
          path: currentPath,
        })
      }
      setAllLineData(totalPath)
      props.setLoading(false)
    }
  }

  return (
    <div className="h-full w-full relative">
      <DeckGL
        initialViewState={initialState}
        controller={true}
        layers={layers}
      >
        <Tooltip hoverPickInfo={hoverPickInfo} />
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={props.mapStyle.styleUrl} />
      </DeckGL>
    </div>
  )
}

export default Component
