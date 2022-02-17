import { atom, selector } from 'recoil'

const globalStyle = atom<string>({
  key: 'globalStyle',
  default: 'light',
})

const p_city = atom<string>({
  key: 'p_city',
  default: localStorage.getItem('busvis_selectCity') || 'beijing',
})

const currentCity = selector<string>({
  key: 'currentCity',
  get: ({ get }) => {
    return get(p_city)
  },
  set: ({ set }, newValue) => {
    if (typeof(newValue) === 'string') {
      localStorage.setItem('busvis_selectCity', newValue) 
    }
    set(p_city, newValue)
  }
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
