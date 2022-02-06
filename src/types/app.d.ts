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
  name: string
  path: [number, number][]
}

interface searchResult {
  line_result: {
    id: string
    name: string
  }[]
  stop_result: {
    id: string
    name: string
  }[]
}
