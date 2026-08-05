import React from 'react'
import './Cards.css'

function Cards(props) {
  return (
    <div className="card" >
      <img src={props.image} alt="Card Image" style = {{width:'100%',background:'center/cover no-repeat'}}/>
      <h3 className="card-title">{props.title}</h3>
      <p className="card-description">{props.description}</p>
    </div>
  )
}

export default Cards