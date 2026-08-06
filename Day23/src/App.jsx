import Button from './components/button'
import Toggle from './components/Toggle'
import { useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState('light')

  return (
    <div className={mode}>
      <Button />
      <Toggle/>
    </div>
  )
}

export default App
