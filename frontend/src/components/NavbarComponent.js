import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
const NavbarComponent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  const logout = () =>{
    localStorage.removeItem("token");
    navigate("/login");
  }


  return (
    <nav className='Navbar'>
      <h2 className='Application-name'>💡BlogSphere</h2>
      
      {token && 
        <>
          <Link className='navbar-component' to="/">Home</Link>
          <Link className='navbar-component' to="/create">Create Blog</Link>
          <button className='logout-button' onClick={logout} >Logout</button>
        </>
      }

      {!token &&
      <>
        <Link className='navbar-component' to="/login">Login</Link>
        <Link className='navbar-component' to="/signup">Signup</Link>
      </>
      }
    </nav>
  )
}

export default NavbarComponent