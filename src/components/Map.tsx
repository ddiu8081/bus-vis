import { useState, useEffect, useRef } from 'react'
import React from 'react'
import ky from 'ky'
import gcoord from 'gcoord'
import { Scene, PointLayer, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import { GaodeMap } from '@antv/l7-maps';

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
        style: 'light',
        pitch: 0,
        center: [116.4, 39.9],
        zoom: 9,
        plugin: []
      }),
    });
    scene.on('loaded', () => {
      console.log('loaded')
      loadData()
    })
    // scene.on('click', (ev) => {
    //   console.log(ev)
    //   loadData()
    // })
    
  })

  const loadData = async () => {
    const data_line: string[] = await ky.get('https://service-4a2rnaqt-1251746595.bj.apigw.tencentcs.com/data/line', {searchParams: {city: '1'}}).json()
    // console.log(data_line)
    if (data_line) {
      const totalPath = []
      for (let i = 0; i < data_line.length; i++) {
        const line_str = data_line[i]
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
      console.log(totalPath)
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
        .size(0.6)
        .shape('line')
        .color('#312e81')
  
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
