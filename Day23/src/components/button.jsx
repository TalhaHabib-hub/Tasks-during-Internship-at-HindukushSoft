import './button.css'
import { useState } from 'react'
function Button(){
  const [count, setCount] = useState(0)
  return <>  
  <button onClick={() => setCount(count + 1)} className='button-click'>Click me</button>
  <p className='count'>Count: {count}</p>
  </>

}
export default Button