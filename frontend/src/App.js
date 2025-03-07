import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateBlog from './pages/CreateBlog'
import Navbar from './components/NavbarComponent'
import PrivateRoute from './PrivateRoute'
import BlogCard from './components/BlogCard'
import BlogUpdate from './pages/BlogUpdate'

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>

        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute/>} >
          <Route path="/" element={<Home />} />
          <Route path="/blogs/:id" element={<BlogCard/>} />
          <Route path="/edit/:id" element={<BlogUpdate/>} />
          <Route path="/create" element={<CreateBlog />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App