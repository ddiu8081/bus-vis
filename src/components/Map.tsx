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
    const data_line = await ky.get('https://ddiu-10049571.cos.ap-shanghai.myqcloud.com/beijing_line_1643535095.json').json()
    const lineLayer = new LineLayer()
      .source(data_line)
      .size(0.6)
      .shape('line')
      .color('#312B60')

    scene.addLayer(lineLayer)
    lineLayer.show()
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
