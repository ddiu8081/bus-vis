import { Icon } from '@iconify/react'
import { useRecoilState } from 'recoil'

import store from '../stores/App.store'
import dataSet from '../data/dataList'

export interface Props {}

const Component = (props: Props) => {
  const [mapView, setMapView] = useRecoilState(store.mapView)
  const [currentCity, setCurrentCity] = useRecoilState(store.currentCity)

  const mapViewDict = {
    line: '线路',
    stop: '站点',
  }

  const cityList = dataSet.cityList

  const listItem = Object.keys(cityList).map((item) =>
    <li key={item} onClick={() => { setCurrentCity(item) }}>
      <span className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-600">{cityList[item].name}</span>
    </li>
  )

  return (
    <div className="absolute flex left-4 top-4 z-10 w-96">
      <div className="flex items-center">
        <button id="dropdownButton" data-dropdown-toggle="dropdown" className="flex items-center py-2 px-3 divide-y divide-gray-100 font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white">
          <span className="mr-1">
            <span>{cityList[currentCity].name}</span>
            <span> · {mapViewDict[mapView]}</span>
          </span>
          <Icon icon="gg:chevron-down" />
        </button>
        <div id="dropdown" className="hidden z-10 w-36 list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-stone-700">
          <ul className="py-1" aria-labelledby="dropdownButton">
            {listItem}
          </ul>
          <ul className="py-1" aria-labelledby="dropdownButton">
            <li onClick={() => { setMapView('line') }} className="flex items-center justify-between py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-600">
              <span className={mapView === 'line' ? 'text-yellow-600' : ''}>{mapViewDict.line}</span>
              <Icon icon="gg:attribution" className="opacity-50" />
            </li>
            <li onClick={() => { setMapView('stop') }} className="flex items-center justify-between py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-600">
              <span className={mapView === 'stop' ? 'text-yellow-600' : ''}>{mapViewDict.stop}</span>
              <Icon icon="gg:record" className="opacity-50" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Component
