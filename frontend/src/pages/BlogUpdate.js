import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogUpdate.css"; // Import CSS styles

const BlogUpdate = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Get logged-in user ID from localStorage
  const loggedInUserId = localStorage.getItem("id");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:4444/blogs/${id}`);
        const blog = res.data;

        // Ensure only the author can access this page
        if (blog.author._id !== loggedInUserId) {
          alert("Unauthorized! You are not the author of this blog.");
          navigate("/");
          return;
        }

        // Populate form with existing data
        setTitle(blog.title);
        setContent(blog.content);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, loggedInUserId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4444/blogs/${id}`,
        { title, content },
        { headers: { Authorization: `${localStorage.getItem("token")}` } } // If using JWT
      );

      alert("Blog updated successfully!");
      navigate(`/blogs/${id}`); // Redirect to the updated blog page
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update the blog.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="blog-update-container">
      <h2>Edit Blog</h2>
      <form onSubmit={handleUpdate}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Content:</label>
        <textarea
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit" className="update-btn">Update Blog</button>
      </form>
    </div>
  );
};

export default BlogUpdate;
