import Button from './components/button'
import { useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState('light')

  return (
    <div className={mode}>
      <Button />
      <button onClick={()=>{setMode(mode === 'light' ? 'dark' : 'light')}}>Toggle Theme</button>
    </div>
  )
}

export default App
