import { useState } from 'react'
import logo from './logo.svg'
import cityList from './data/cityList'

import Map from './components/Map'
import CornerPanel from './components/CornerPanel'
import Spinner from './components/Spinner'

function App() {
  const [loading, setLoading] = useState(true)
  const [animate, setAnimate] = useState(false)
  const [count, setCount] = useState(0)
  const [currentCity, setCurrentCity] = useState(cityList.beijing)

  return (
    <div className="w-screen h-screen relative">
      <CornerPanel animate={animate} setAnimate={setAnimate} currentCity={currentCity} cityList={cityList} setCity={setCurrentCity} />
      <Spinner show={loading} />
      <Map setLoading={setLoading} animate={animate} currentCity={currentCity} />
    </div>
  )
}

export default App
