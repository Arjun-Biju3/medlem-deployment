import React from 'react'
import { NavLink } from 'react-router-dom'

function Navlinks({logout}) {
  return (
    <div>
      <NavLink onClick={logout} style={{textDecoration:"none", color:"white"}} to={"/"} >Logout</NavLink>
    </div>
  )
}

export default Navlinks
