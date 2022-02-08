import { atom } from 'recoil'

const currentHighlightQuery = atom<HightlightQueryItem | null>({
  key: 'currentHighlightQuery',
  default: null,
})

const currentHighlight = atom<HightlightItem | null>({
  key: 'currentHighlight',
  default: null,
})

export default {
  currentHighlightQuery,
  currentHighlight,
}
