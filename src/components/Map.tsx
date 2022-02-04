import { useState, useEffect, useRef } from 'react'
import React from 'react'
import ky from 'ky'
import gcoord from 'gcoord'
import md5 from 'js-md5'

import DeckGL from '@deck.gl/react'
import { FlyToInterpolator } from 'deck.gl'
import { StaticMap } from 'react-map-gl'
import { ViewStateProps } from '@deck.gl/core/lib/deck'
import { PathLayer } from '@deck.gl/layers'

export interface Props {
  setLoading: (loading: boolean) => void
  currentCity: CityItem
  mapStyle: MapStyleItem
}

const Component = (props: Props) => {
  const mapContainer = useRef(null)
  const [initialState, setInitialState] = useState<ViewStateProps | undefined>(undefined)
  const [layers, setLayers] = useState<any[]>([])

  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (!mapContainer.current) {
      return
    }
  }, [])

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
    loadData(props.currentCity.id)
  }, [props.mapStyle])

  const decryptText = (encryptedText: string): string => {
    let newTextArr = encryptedText.split('').reverse()
    newTextArr = newTextArr.map(char => {
      const charCode = char.charCodeAt(0)
      return String.fromCharCode(charCode - 1)
    })
    const newText = newTextArr.join('')
    const decodedText = atob(newText)
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
      const totalPath = []
      for (let i = 0; i < parsed.length; i++) {
        const line_str = parsed[i]
        const points = line_str.split(';').map(p => p.split(','))
        let last_blng = 0
        let last_blat = 0
        let currentPath: [number, number][] = []
        for (let j = 0; j < points.length; j++) {
          const point = points[j]
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
          path: currentPath,
          name: line_str,
        })
      }

      const layer = new PathLayer({
        id: 'path-layer',
        data: totalPath,
        pickable: true,
        autoHighlight: true,
        widthScale: 10,
        widthMinPixels: 1.2,
        widthMaxPixels: 2.4,
        jointRounded: true,
        getPath: d => d.path,
        getColor: props.mapStyle.foreground,
        getWidth: 5,
      })

      setLayers([layer])
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
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={props.mapStyle.styleUrl} />
      </DeckGL>
    </div>
  )
}

export default Component
