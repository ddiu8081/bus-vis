interface CityItem {
  id: string
  name: string
  location: [number, number]
}

interface CityList {
  [Key: string]: CityItem
}

interface MapStyleItem {
  id: string
  styleUrl: string
  foreground: [number, number, number, number]
}

interface MapStyleList {
  [Key: string]: MapStyleItem
}

interface DrawLineItem {
  id: string
  name: string
  path: [number, number][]
  polyline_min?: string
  color?: string
}

interface SearchResult {
  line_result: {
    id: string
    name: string
  }[]
  stop_result: {
    id: string
    name: string
  }[]
}

interface RequestResult<T> {
  code: number
  data: T
}

interface HightlightQueryItem {
  type: 'line' | 'stop'
  id: string
}

interface StopData {
  id: string
  name: string
  location: [number, number]
  address: string
  lines_detail: DrawLineItem[]
}

interface DrawStopItem {
  id: string
  name: string
  location: [number, number]
}

interface LineData {
  name: string
  path: [number, number][]
  polyline_min?: string
  bounds: [[number, number], [number, number]]
  start_stop: string
  end_stop: string
  run_time: string
  loop: boolean
  status: boolean
  direc: string
  distance: number
  busstops: DrawStopItem[]
  updated_at: number
}

interface HightlightItem {
  type: 'line' | 'stop'
  stop_data?: StopData
  line_data?: LineData
}
