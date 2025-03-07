import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import './General.css'


const Signup = () => {
  const [formData, setformData] = useState({name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  

  const handleChange = (e) =>{
    setformData({...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  }
  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-input'>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Signup</button>
        </div>
        
      </form>
    </div>
  )
}

export default Signup