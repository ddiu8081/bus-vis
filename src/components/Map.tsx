import { useState, useEffect, useRef } from 'react'
import React from 'react'
import ky from 'ky'
import gcoord from 'gcoord'
import { Scene, PointLayer, LineLayer } from '@antv/l7'
import { Mapbox } from '@antv/l7-maps'
import { GaodeMap } from '@antv/l7-maps'
import md5 from 'js-md5'

export interface Props {}

const Component = (props: Props) => {
  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(116.4)
  const [lat, setLat] = useState(39.9)
  const [zoom, setZoom] = useState(11)
  const [address, setAddress] = useState('')

  let scene: Scene

  useEffect(() => {
    if (map.current) {
      return
    }
    if (!mapContainer.current) {
      return
    }
    scene = new Scene({
      id: mapContainer.current,
      logoVisible: false,
      map: new GaodeMap({
        style: 'dark',
        pitch: 0,
        center: [116.4, 39.9],
        zoom: 9,
        minZoom: 9,
        rotateEnable: false,
        plugin: [],
      }),
    })
    scene.on('loaded', () => {
      console.log('loaded')
      loadData()
    })
    // scene.on('click', (ev) => {
    //   console.log(ev)
    //   loadData()
    // })
    
  })

  const decryptText = (encryptedText: string): string => {
    let newTextArr = encryptedText.split('').reverse()
    newTextArr = newTextArr.map((char) => {
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

  const generateDownloadUrl = (secret: string, path: string, host: string) => {
    const timestampHex = (Math.floor(Date.now() / 1000)).toString(16)
    const md5Hash = md5(secret + path + timestampHex)
    return `${host}/${md5Hash}/${timestampHex}${path}`
  }

  const loadData = async () => {
    const host = import.meta.env.VITE_CDN_HOST
    const path = '/data/line/beijing.data'
    const secret = import.meta.env.VITE_CDN_VERIFY_SECRET
    const url = generateDownloadUrl(secret, path, host)
    const data_line = await ky.get(url).text()
    const parsed = parseLineData(data_line)
    if (parsed) {
      const totalPath = []
      for (let i = 0; i < parsed.length; i++) {
        const line_str = parsed[i]
        const points = line_str.split(';').map(p => p.split(','))
        let last_blng = 0
        let last_blat = 0
        let path = []
        for (let j = 0; j < points.length; j++) {
          const point = points[j]
          const blng = parseInt(point[0]) + last_blng
          const blat = parseInt(point[1]) + last_blat
          last_blng = blng
          last_blat = blat
          path.push([blng / 1000000, blat / 1000000])
        }
        totalPath.push(path)
      }
      const geoJsonData = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "MultiLineString",
              "coordinates": totalPath
            }
          }
        ]
      }
      const lineLayer = new LineLayer({
        blend: 'normal',
      })
        .source(geoJsonData)
        .size(0.9)
        .shape('line')
        .color('rgba(238, 161, 7, 0.5)')

      lineLayer.animate({
        duration: 5,
        interval: 0.4,
        trailLength: 1.4
      });
  
      scene.addLayer(lineLayer)
      lineLayer.show()

    }
    
  }


  return (
    <div className="h-full w-full relative">
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <div id="mapContainer" ref={mapContainer} className="h-full w-full relative"></div>
    </div>
  )
}

export default Component