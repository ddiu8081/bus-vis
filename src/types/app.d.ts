interface CityItem {
  id: string;
  name: string
  location: [number, number]
}

interface CityList {
  [Key: string]: CityItem
}