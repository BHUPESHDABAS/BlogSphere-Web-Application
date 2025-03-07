import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./CreateBlog.css";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get the logged-in user's ID from JWT token
  const getauthorname = () =>{
    return localStorage.getItem("userName");
  }

  const getAuthorFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.id; // Ensure backend sends 'userId' in JWT
      } catch (err) {
        console.error("Invalid token:", err);
        return "";
      }
    }
    console.log("No token found in localStorage"); // Debugging Step 3
    return "";
  };
  

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const author = getAuthorFromToken();
    if (!author) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    const blogData = {
      title: formData.title,
      content: formData.content,
      author,
    };

    try {
      const token = localStorage.getItem("token");
      console.log("Sending Token:", token); // Debugging
      console.log("Blog Data:", blogData); // Debugging

      await axios.post(`${API_BASE_URL}/blogs`, blogData, {
        headers: {
          Authorization: `${token}`, // If backend expects just token, remove 'Bearer '
          "Content-Type": "application/json",
        },
      });

      alert("Blog created successfully");
      navigate("/");
    } catch (error) {
      console.error("Error creating blog:", error.response?.data || error);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create a New Blog</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-input">
          <textarea
            name="content"
            placeholder="Blog Content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-input">
          <input
            type="text"
            name="author"
            placeholder="Author (Automatically Set)"
            value={getauthorname() || ""}
            disabled
          />
        </div>
        <div className="form-input">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
