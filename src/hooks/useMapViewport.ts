import { useState, useRef } from 'react'
import { WebMercatorViewport } from '@deck.gl/core'
import type { ViewStateProps } from '@deck.gl/core/lib/deck'

import { generateViewStateOptions } from '../interactors/mapUtil'

interface UpdateViewStateConf {
  location: [number, number]
  zoom: number
  duration?: number
}

interface ExtendWebMercatorViewport extends WebMercatorViewport {
  longitude?: number
  latitude?: number
}

function useMapViewport(): [
  ViewStateProps | undefined,
  (conf: UpdateViewStateConf) => void,
  (conf: [[number, number], [number, number]], duration?: number) => void
] {
  const [viewState, setViewState] = useState<ViewStateProps | undefined>(
    undefined
  )
  const viewport = useRef<WebMercatorViewport | undefined>(undefined)

  const updateViewState = (props: UpdateViewStateConf) => {
    setViewState(generateViewStateOptions(props.location, props.zoom, props.duration))
    viewport.current = new WebMercatorViewport({
      ...viewState,
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  const fitBounds = (bounds: [[number, number], [number, number]], duration?: number) => {
    if (viewport.current) {
      const newViewport: ExtendWebMercatorViewport = viewport.current.fitBounds(bounds, {
        padding: 32,
      })
      if (newViewport.longitude && newViewport.latitude) {
        setViewState(generateViewStateOptions([newViewport.longitude, newViewport.latitude], newViewport.zoom, duration))
      }
    }
  }

  return [viewState, updateViewState, fitBounds]
}

export default useMapViewport
