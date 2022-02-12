import { atom } from 'recoil'

const globalStyle = atom<string>({
  key: 'globalStyle',
  default: 'light',
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
  mapView,
  currentHighlightQuery,
  currentHighlight,
}
