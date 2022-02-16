import { useState } from 'react'
import dataSet from './data/dataList'

import Map from './components/Map'
import CornerPanel from './components/CornerPanel'
import SidePanel from './components/SidePanel'
import Spinner from './components/Spinner'
import Meta from './components/Meta'

function App() {
  const [loading, setLoading] = useState(true)
  const [currentCity, setCurrentCity] = useState(dataSet.cityList.beijing)

  return (
    <div className="w-screen h-screen relative">
      <CornerPanel />
      <SidePanel />
      <Spinner show={loading} />
      <Map setLoading={setLoading} />
      <Meta />
    </div>
  )
}

export default App
