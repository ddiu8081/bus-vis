const cityList : CityList = {
  beijing: {
    id: 'beijing',
    name: '北京',
    location: [116.4, 39.9],
  },
  shanghai: {
    id: 'shanghai',
    name: '上海',
    location: [121.4, 31.2],
  },
  guangzhou: {
    id: 'guangzhou',
    name: '广州',
    location: [113.4, 23.1],
  },
  nanjing: {
    id: 'nanjing',
    name: '南京',
    location: [118.8, 32.0],
  },
}

const mapStyleList : MapStyleList = {
  light: {
    id: 'light',
    styleUrl: 'mapbox://styles/ddiu8081/ckz82q8eb000c14o8uw4ky79d',
    foreground: [60, 10, 10, 25],
  },
  dark: {
    id: 'dark',
    styleUrl: 'mapbox://styles/ddiu8081/ckz83gct0000i15qtsgc8z3gz',
    foreground: [238, 161, 7, 25],
  },
}

export default {
  cityList,
  mapStyleList,
}