import './button.css'
import { useState } from 'react'
function Button(){
  const [count, setCount] = useState(0)
  return <>  
  <button onClick={() => setCount(count + 1)} className='button-click'>Click me</button>
  <p>Count: {count}</p>
  </>

}
export default Button