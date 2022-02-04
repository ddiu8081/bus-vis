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
