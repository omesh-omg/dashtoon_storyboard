import React from 'react'
import dashlogo from './images/dashtoonlogo.png'
import './Navbar.css'
const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='logo'>
            <img src={dashlogo} className='logoimg'></img>
        </div>
        <div><h2>Create Your Story Board </h2></div>
    </div>
  )
}

export default Navbar