import { useState } from 'react'
import dataSet from './data/dataList'

import Map from './components/Map'
import CornerPanel from './components/CornerPanel'
import SidePanel from './components/SidePanel'
import Spinner from './components/Spinner'

function App() {
  const [loading, setLoading] = useState(true)
  const [animate, setAnimate] = useState(false)
  const [count, setCount] = useState(0)
  const [currentCity, setCurrentCity] = useState(dataSet.cityList.beijing)
  const [mapStyle, setMapStyle] = useState('light')

  return (
    <div className="w-screen h-screen relative">
      <CornerPanel currentCity={currentCity} cityList={dataSet.cityList} setCity={setCurrentCity} />
      <SidePanel currentCityId={currentCity.id} mapStyleId={mapStyle} setMapStyleId={setMapStyle} />
      <Spinner show={loading} />
      <Map setLoading={setLoading} currentCity={currentCity} mapStyle={dataSet.mapStyleList[mapStyle]} />
    </div>
  )
}

export default App
