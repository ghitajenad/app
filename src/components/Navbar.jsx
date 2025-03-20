import React from 'react'
import { Form, Link } from 'react-router-dom'
import '../App.css'
import logo3 from './Images/logo3.png'
export const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg bgnav '>
      <img src={logo3} alt="" width="450" height="200"  className='text-start d-block' />
    </nav>
   
  )
}
