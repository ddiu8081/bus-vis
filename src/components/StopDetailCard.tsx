import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useDebounce } from 'react-use'
import { useRecoilState, useResetRecoilState } from 'recoil'

import store from '../stores/App.store'
import { getStopDeatilById } from '../api'

export interface Props {
  queryId: string
}

const Component = (props: Props) => {
  const [currentHightlight, setCurrentHightlight] = useRecoilState(
    store.currentHighlight
  )
  const [searchResult, setSearchResult] = useState<SearchResult>({
    line_result: [],
    stop_result: [],
  })
  const [isSearching, setIsSearching] = useState(true)

  const getAndRenderData = async (poi_id: string) => {
    const result = await getStopDeatilById(poi_id)
    if (result) {
      setCurrentHightlight({
        type: 'stop',
        stop_data: result,
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
          {stopData.cityname} - {stopData.adname}
        </span>
      </header>
      <main className="py-2 text-gray-700 dark:text-gray-200">
        <h3 className="px-4 py-1.5 text-sm font-medium opacity-50">途径线路</h3>
        <div className="max-h-72 overflow-y-auto">
          {stopData.lines_detail && stopData.lines_detail.map(line => (
            <div
              key={line.id}
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
    <div className="w-72 mt-2 bg-white rounded-lg shadow-sm dark:bg-stone-700">
      {!currentHightlight && infoDom}
      {currentHightlight?.stop_data && detailDom(currentHightlight.stop_data)}
    </div>
  )
}

export default Component
