import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useDebounce } from 'react-use'
import { useSetRecoilState } from 'recoil'

import store from '../stores/App.store'
import { searchByKeyword } from '../api'

export interface Props {
  currentCityId: string
  searchText: string
}

const Component = (props: Props) => {
  const setCurrentHighlightQuery = useSetRecoilState(
    store.currentHighlightQuery
  )
  const [searchResult, setSearchResult] = useState<SearchResult>({
    line_result: [],
    stop_result: [],
  })
  const [isSearching, setIsSearching] = useState(true)

  useEffect(() => {
    if (props.searchText) {
      setIsSearching(true)
      setSearchResult({
        line_result: [],
        stop_result: [],
      })
    }
  }, [props.searchText])

  useDebounce(
    async () => {
      if (!props.searchText) {
        return
      }
      const result = await searchByKeyword(
        props.currentCityId,
        props.searchText
      )
      setSearchResult(result)
      setIsSearching(false)
    },
    1000,
    [props.searchText]
  )

  const handleSearchResultClick = (type: 'line' | 'stop', id: string) => {
    setCurrentHighlightQuery({
      type,
      id,
    })
  }

  const infoText = isSearching ? '搜索中...' : '没有找到相关结果'

  const infoDom = (
    <div className="flex items-center">
      <span className="px-4 py-2 text-sm">{infoText}</span>
    </div>
  )

  return (
    <div className={props.searchText ? 'block' : 'hidden'}>
      <div className="w-72 mt-2 py-2 text-gray-600 dark:text-gray-300 bg-white rounded-lg shadow-sm dark:bg-stone-700">
        {searchResult.line_result.length > 0 && (
          <div className="flex flex-col mb-2">
            <h3 className="px-4 py-1.5 text-sm font-medium opacity-50">线路</h3>
            {searchResult.line_result.map(line => (
              <div
                key={line.id}
                onClick={() => handleSearchResultClick('line', line.id)}
                className="flex items-center px-4 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-600 cursor-pointer"
              >
                <span className="text-sm">{line.name}</span>
              </div>
            ))}
          </div>
        )}
        {searchResult.stop_result.length > 0 && (
          <div className="flex flex-col mb-2">
            <h3 className="px-4 py-1.5 text-sm font-medium opacity-50">站点</h3>
            {searchResult.stop_result.map(stop => (
              <div
                key={stop.id}
                onClick={() => handleSearchResultClick('stop', stop.id)}
                className="flex items-center px-4 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-600 cursor-pointer"
              >
                <span className="text-sm">{stop.name}</span>
              </div>
            ))}
          </div>
        )}
        {searchResult.line_result.length + searchResult.stop_result.length ===
          0 && infoDom}
      </div>
    </div>
  )
}

export default Component
