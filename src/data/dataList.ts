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
  chengdu: {
    id: 'chengdu',
    name: '成都',
    location: [104.0, 30.6],
  },
  chongqing: {
    id: 'chongqing',
    name: '重庆',
    location: [106.5, 29.5],
  },
}

const mapStyleList : MapStyleList = {
  light: {
    id: 'light',
    styleUrl: 'mapbox://styles/ddiu8081/ckz82q8eb000c14o8uw4ky79d',
    foreground: [105, 78, 78, 30],
  },
  dark: {
    id: 'dark',
    styleUrl: 'mapbox://styles/ddiu8081/ckz83gct0000i15qtsgc8z3gz',
    foreground: [238, 161, 7, 25],
  },
}

const mapIcon = {
  spriteUrl: 'https://cloud-upyun.ddiu.site/picture/2022/02/12/4Yae1l.png',
  iconMap: {
    stop_sm: {x: 0, y: 0, width: 24, height: 24},
    stop_md: {x: 0, y: 34, width: 48, height: 48},
    stop_lg: {x: 58, y: 34, width: 54, height: 54},
  }
}

export default {
  cityList,
  mapStyleList,
  mapIcon,
}