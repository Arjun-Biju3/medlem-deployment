import React from 'react'
import MainHeader from './MainHeader'
import Navlinks from './Navlinks'
import './MainHeader.css'
import { Link } from 'react-router-dom'

function MainNavigation({type,username,logout}) {
  return (
    <div>
      <MainHeader>
       <div className='nav-bar'>
       <div className='nav-type'><Link style={{textDecoration:"none",color:"white"}} to={"/"} >{type}</Link></div>
        <div className='nav-item'>
        <p>{username}</p>
        <Navlinks logout={logout} />
        </div>
       </div>
      </MainHeader>
    </div>
  )
}

export default MainNavigation
