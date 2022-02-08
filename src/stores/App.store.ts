import { atom } from 'recoil'

const globalStyle = atom<string>({
  key: 'globalStyle',
  default: 'light',
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
  currentHighlightQuery,
  currentHighlight,
}
