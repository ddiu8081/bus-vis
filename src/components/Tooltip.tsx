import { PickInfo } from 'deck.gl'
import { useState, useEffect, useRef } from 'react'

export interface Props {
  hoverPickInfo: PickInfo<DrawLineItem> | null
}

const Component = (props: Props) => {
  const [address, setAddress] = useState('')

  useEffect(() => {})

  return props.hoverPickInfo?.object?.name ? (
    <div
      className="absolute z-20 p-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 rounded shadow"
      style={{
        left: props.hoverPickInfo.x + 10,
        top: props.hoverPickInfo.y + 10,
      }}
    >
      {props.hoverPickInfo.object.name}
    </div>
  ) : (
    <div></div>
  )
}

export default Component
