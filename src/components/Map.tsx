import { useState, useEffect, useRef } from 'react'
import React from 'react'
import mapboxgl from 'mapbox-gl'
import ky from 'ky'
import gcoord from 'gcoord'

import 'mapbox-gl/dist/mapbox-gl.css'

export interface Props {}

const Component = (props: Props) => {
  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng, setLng] = useState(116.4)
  const [lat, setLat] = useState(39.9)
  const [zoom, setZoom] = useState(11)
  const [address, setAddress] = useState('')
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  console.log(import.meta.env.VITE_MAPBOX_ACCESS_TOKEN)

  useEffect(() => {
    if (map.current) {
      return
    }
    if (!mapContainer.current) {
      return
    }
    let mapCom = (map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
    }))

    mapCom.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    )

    mapCom.on('click', async e => {
      // When the map is clicked, get the geographic coordinate.
      const coordinate = mapCom.unproject(e.point)
      console.log(coordinate)
    })
  })

  return (
    <div className="h-full w-full relative">
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <div ref={mapContainer} className="h-full w-full relative"></div>
    </div>
  )
}

export default Component
