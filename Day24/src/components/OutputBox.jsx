import React from 'react'
import './OutpuBox.css'

function OutputBox(props) {
  return (
    <div className='outputBox'>
      <div className="round">{props.form.Name[0]||'?'}</div>
      <div className="name">{props.form.Name||'name'}</div>
      <div className="email">{props.form.email||'email'}</div>
      <div className="student">student</div>
      <div className="message">{props.form.message ||'message'}</div>
    </div>
  )
}

export default OutputBox