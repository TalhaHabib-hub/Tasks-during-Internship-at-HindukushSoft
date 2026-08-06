import React from 'react'
import './Box.css'
function BoxInput(props) {
  function handleChange(e){
    const{id,value}=e.target
    props.setform({...props.form,[id]:value})
  }
  return <div className="boxInput">
            <label htmlFor="Name">Name</label>
            <input type="text" id="Name" placeholder="Enter your name" value={props.form.Name}
            onChange={handleChange}/>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={props.form.email}
            onChange={handleChange}/>
            <label htmlFor="message">Message</label>
            <textarea id="message" placeholder="Enter your message"
            value={props.form.message}
            onChange={handleChange}></textarea>
         </div>
  
}

export default BoxInput