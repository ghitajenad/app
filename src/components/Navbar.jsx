import React from 'react'
import { Form, Link } from 'react-router-dom'
import logo from './Images/logo.jpg'
export const Navbar = () => {
  return (
    <nav>
      <img src={logo} alt="" width="300" className='text-start d-block' />
    </nav>
  )
}
