import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

import Spinner from './Spinner'

export interface Props {}

const Component = (props: Props) => {
  const [address, setAddress] = useState('')

  useEffect(() => {})

  return (
    <div className="absolute left-4 top-4 z-10 w-96">
      <div className="flex items-center text-white">
        <button id="dropdownButton" data-dropdown-toggle="dropdown" className="flex items-center py-2 pr-4 pl-3 w-full font-medium text-gray-400 hover:bg-gray-700 md:hover:bg-transparent hover:text-white focus:text-white">
          <span className="mr-1">北京</span>
          <Icon icon="gg:chevron-down" />
        </button>
        <div id="dropdown" className="hidden z-10 w-36 list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
            <ul className="py-1" aria-labelledby="dropdownButton">
              <li>
                <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">北京</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">上海</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">南京</a>
              </li>
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Component
