import './Toggle.css'
import { useState } from 'react'

function Toggle({mode, setMode}) {
  
  
  return (<>
     <button onClick={()=>{setMode(mode === 'light' ? 'dark' : 'light')}}className="toggle-button">Toggle Theme</button>
  </>
  )
}

export default Toggle