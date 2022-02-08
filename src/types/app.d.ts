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
  name: string
  location: [number, number]
  cityname: string
  adname: string
  lines: string
  lines_detail: DrawLineItem[]
}

interface HightlightItem {
  type: 'line' | 'stop'
  stop_data?: StopData
}
