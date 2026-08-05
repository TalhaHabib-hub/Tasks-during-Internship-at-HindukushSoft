
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [mode, setMode] = useState('light')

  return (
    <div className={mode}>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>Count: {count}</p>
      <button onClick={()=>{setMode(mode === 'light' ? 'dark' : 'light')}}>Toggle Theme</button>
    </div>
  )
}

export default App
