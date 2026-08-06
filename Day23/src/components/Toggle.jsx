
import { useState } from 'react'

function Toggle() {
  
  
  return (<>
     <button onClick={()=>{setMode(mode === 'light' ? 'dark' : 'light')}}>Toggle Theme</button>
  </>
  )
}

export default Toggle