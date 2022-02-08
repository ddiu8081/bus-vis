import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useRecoilValue } from 'recoil'

import store from '../stores/App.store'
import SearchCard from './SearchCard'
import StopDetailCard from './StopDetailCard'


export interface Props {
  currentCityId: string
  mapStyleId: string
  setMapStyleId: (mapStyleId: string) => void
}

const Component = (props: Props) => {
  const [searchText, setSearchText] = useState('')
  const currentHighlightQuery = useRecoilValue(store.currentHighlightQuery)

  useEffect(() => {})

  const handleToggleMapStyle = () => {
    const shouldSwitchMapStyleId =
      props.mapStyleId === 'light' ? 'dark' : 'light'
    props.setMapStyleId(shouldSwitchMapStyleId)
    document.documentElement.className = shouldSwitchMapStyleId
  }

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value)
  }

  return (
    <div className="absolute flex flex-col items-end right-4 top-4 z-10">
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleToggleMapStyle}
          className="p-2.5 mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg"
        >
          {props.mapStyleId == 'light' ? (
            <Icon icon="ri:sun-fill" className="w-5 h-5" />
          ) : (
            <Icon icon="ri:moon-fill" className="w-5 h-5" />
          )}
        </button>
        <div className="relative w-64 text-gray-600 dark:text-gray-300">
          <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
            <Icon icon="gg:search" className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            className="block w-full pr-10 py-2.5 px-3 bg-gray-50 dark:bg-stone-700 hover:bg-white border border-gray-300 text-sm rounded-lg focus:ring-yellow-400 focus:border-yellow-400 dark:border-stone-600 placeholder-stone-400/50"
            placeholder="搜索线路或站点"
          />
        </div>
      </div>
      <SearchCard currentCityId={props.currentCityId} searchText={searchText} />
      {currentHighlightQuery?.type == 'stop' && <StopDetailCard queryId={currentHighlightQuery.id} />}
    </div>
  )
}

export default Component
