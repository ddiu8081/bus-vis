import { useState } from 'react'
import logo from './logo.svg'

import Map from './components/Map'
import Logo from './components/Logo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-screen h-screen">
      <Map />
    </div>
  )
}

export default App
