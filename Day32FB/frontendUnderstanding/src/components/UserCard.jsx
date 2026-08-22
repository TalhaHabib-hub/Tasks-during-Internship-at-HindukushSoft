import React from "react";
 const UserCard =({data})=>{
  let a = 0;
  return(
      <div className="user-card" key={a++}>
        <img className='user-img' src = {data.picture.large}/>
        <h3>{data.name.first}</h3>
        <p>{data.phone}</p>
        <p>{data.location.city},{data.location.state}</p>
        <p>{data.registered.date}, {data.location.country}</p>
        {console.log(data)}
      </div>

  )
}
export default UserCard