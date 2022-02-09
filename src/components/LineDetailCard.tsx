import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import store from '../stores/App.store'
import { getLineDeatilById } from '../interactors/api'

export interface Props {
  queryId: string
}

const Component = (props: Props) => {
  const [currentHighlight, setCurrentHighlight] = useRecoilState(
    store.currentHighlight
  )
  const setCurrentHighlightQuery = useSetRecoilState(
    store.currentHighlightQuery
  )
  const [isSearching, setIsSearching] = useState(true)

  const getAndRenderData = async (poi_id: string) => {
    const result = await getLineDeatilById(poi_id)
    if (result) {
      setCurrentHighlight({
        type: 'line',
        line_data: result,
      })
    }
    setIsSearching(false)
  }

  useEffect(() => {
    if (props.queryId) {
      setIsSearching(true)
      getAndRenderData(props.queryId)
    }
  }, [props.queryId])

  const handleClearHighlight = () => {
    setCurrentHighlight(null)
    setCurrentHighlightQuery(null)
  }

  const handleClickStopItem = (id: string) => {
    setCurrentHighlight(null)
    setCurrentHighlightQuery({
      type: 'stop',
      id: id,
    })
  }

  const infoText = isSearching ? '搜索中...' : '没有找到相关结果'

  const infoDom = (
    <div className="flex items-center">
      <span className="px-4 py-2 text-sm">{infoText}</span>
    </div>
  )

  const detailDom = (lineData: LineData) => (
    <div className="flex flex-col">
      <header className="px-4 py-3 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-medium">{lineData.name}</h2>
        <span className="opacity-50 text-sm">
          {lineData.distance} km
        </span>
      </header>
      <main className="py-2 text-gray-700 dark:text-gray-200">
        <h3 className="px-4 py-1.5 text-sm font-medium opacity-50">途径站点</h3>
        <div className="max-h-72 overflow-y-auto">
          {lineData.busstops &&
            lineData.busstops.map(lineStop => (
              <div
                key={lineStop.id}
                onClick={() => handleClickStopItem(lineStop.id)}
                className="flex items-center px-4 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-600 cursor-pointer"
              >
                <span className="text-sm">{lineStop.name}</span>
              </div>
            ))}
        </div>
      </main>
    </div>
  )

  return (
    <div className="relative w-72 mt-2 bg-white rounded-lg shadow-sm dark:bg-stone-700">
      <button
        type="button"
        onClick={handleClearHighlight}
        className="absolute top-2 right-2 p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg"
      >
        <Icon icon="gg:close" className="w-5 h-5" />
      </button>
      {!currentHighlight && infoDom}
      {currentHighlight?.line_data && detailDom(currentHighlight.line_data)}
    </div>
  )
}

export default Component
