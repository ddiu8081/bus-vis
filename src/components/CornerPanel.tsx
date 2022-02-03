import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

export interface Props {
  currentCity: CityItem
  cityList: CityList
  setCity: (city: CityItem) => void
}

const Component = (props: Props) => {
  const [address, setAddress] = useState('')

  useEffect(() => {})

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
      <div className="flex items-center">
        <button id="dropdownButton" data-dropdown-toggle="dropdown" className="flex items-center py-2 pr-4 pl-3 font-medium text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white">
          <span className="mr-1">{props.currentCity.name}</span>
          <Icon icon="gg:chevron-down" />
        </button>
        <div id="dropdown" className="hidden z-10 w-36 list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
            <ul className="py-1" aria-labelledby="dropdownButton">
              {listItem}
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Component
