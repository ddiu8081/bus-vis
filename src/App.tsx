import { useState } from 'react'
import logo from './logo.svg'

import Map from './components/Map'
import CornerPanel from './components/CornerPanel'
import Spinner from './components/Spinner'

function App() {
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)

  return (
    <div className="w-screen h-screen relative">
      <CornerPanel />
      <Spinner show={loading} />
      <Map setLoading={setLoading} />
    </div>
  )
}

export default App
