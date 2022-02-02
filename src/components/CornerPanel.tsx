import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

import Spinner from './Spinner'

export interface Props {
  animate: boolean
  setAnimate: (animate: boolean) => void
  currentCity: CityItem
  cityList: CityList
  setCity: (city: CityItem) => void
}

const Component = (props: Props) => {
  const [address, setAddress] = useState('')

  useEffect(() => {})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setAnimate(e.target.checked)
  }

  const handleSelectCity = (city: CityItem) => {
    props.setCity(city)
  }

  const listItem = Object.keys(props.cityList).map((item) =>
    <li key={item} onClick={() => { handleSelectCity(props.cityList[item]) }}>
      <span className="block py-2 px-4 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">{props.cityList[item].name}</span>
    </li>
  )

  return (
    <div className="absolute left-4 top-4 z-10 w-96">
      <div className="flex items-center text-white">
        <button id="dropdownButton" data-dropdown-toggle="dropdown" className="flex items-center py-2 pr-4 pl-3 w-full font-medium text-gray-400 hover:bg-gray-700 md:hover:bg-transparent hover:text-white focus:text-white">
          <span className="mr-1">{props.currentCity.name}</span>
          <Icon icon="gg:chevron-down" />
        </button>
        <div id="dropdown" className="hidden z-10 w-36 list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
            <ul className="py-1" aria-labelledby="dropdownButton">
              {listItem}
            </ul>
        </div>
      </div>
      {/* <label className="flex relative items-center mb-4 cursor-pointer">
        <input type="checkbox" id="toggle-example" className="sr-only" checked={props.animate} onChange={handleChange} />
        <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Animate</span>
      </label> */}
    </div>
  )
}

export default Component
