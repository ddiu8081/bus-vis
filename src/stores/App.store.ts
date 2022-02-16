import { atom } from 'recoil'

const globalStyle = atom<string>({
  key: 'globalStyle',
  default: 'light',
})

const currentCity = atom<string>({
  key: 'currentCity',
  default: 'beijing',
})

const mapView = atom<'line' | 'stop'>({
  key: 'mapView',
  default: 'line',
})

const currentHighlightQuery = atom<HightlightQueryItem | null>({
  key: 'currentHighlightQuery',
  default: null,
})

const currentHighlight = atom<HightlightItem | null>({
  key: 'currentHighlight',
  default: null,
})

export default {
  globalStyle,
  currentCity,
  mapView,
  currentHighlightQuery,
  currentHighlight,
}
