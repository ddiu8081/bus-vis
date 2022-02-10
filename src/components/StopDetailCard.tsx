import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import store from '../stores/App.store'
import { getStopDeatilById } from '../interactors/api'
import { decodeMinifyLineData } from '../interactors/mapUtil'

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
    const result = await getStopDeatilById(poi_id)
    const newResult = {}
    if (result) {
      // Generate full path of stoplines
      const fullLineData = result.lines_detail.map(line => {
        return {
          ...line,
          path: decodeMinifyLineData(line.polyline_min),
        }
      })
      setCurrentHighlight({
        type: 'stop',
        stop_data: {
          ...result,
          lines_detail: fullLineData,
        },
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

  const handleClickLineItem = (id: string) => {
    setCurrentHighlight(null)
    setCurrentHighlightQuery({
      type: 'line',
      id: id,
    })
  }

  const infoText = isSearching ? '搜索中...' : '没有找到相关结果'

  const infoDom = (
    <div className="flex items-center">
      <span className="px-4 py-2 text-sm">{infoText}</span>
    </div>
  )

  const detailDom = (stopData: StopData) => (
    <div className="flex flex-col">
      <header className="px-4 py-3 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-medium">{stopData.name}</h2>
        <span className="opacity-50 text-sm">
          {stopData.address}
        </span>
      </header>
      <main className="py-2 text-gray-700 dark:text-gray-200">
        <h3 className="px-4 py-1.5 text-sm font-medium opacity-50">途径线路</h3>
        <div className="max-h-72 overflow-y-auto">
          {stopData.lines_detail &&
            stopData.lines_detail.map(line => (
              <div
                key={line.id}
                onClick={() => handleClickLineItem(line.id)}
                className="flex items-center px-4 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-600 cursor-pointer"
              >
                <span className="text-sm">{line.name}</span>
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
      {currentHighlight?.stop_data && detailDom(currentHighlight.stop_data)}
    </div>
  )
}

export default Component
