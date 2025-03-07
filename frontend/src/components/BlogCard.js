import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogCard.css"; // Import styles

const BlogCard = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get logged-in user ID from localStorage
  const loggedInUsername = localStorage.getItem("userName"); // Ensure you store this at login

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:4444/blogs/${id}`);
        setBlog(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found</p>;

  console.log(loggedInUsername);
  console.log(blog.author.name);


  // Check if the logged-in user is the author
  const isAuthor = blog.author.name === loggedInUsername;

  // Handle Delete Blog
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4444/blogs/${id}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` }, // If using JWT
      });
      alert("Blog deleted successfully!");
      navigate("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog.");
    }
  };

  // Handle Edit Blog (Redirect to Edit Page)
  const handleEdit = () => {
    navigate(`/edit/${id}`); // Assuming you have an edit page
  };

  return (
    <div className="blog-card">
      <h2>{blog.title}</h2>
      <p>
        <strong>By:</strong> {blog.author.name}
      </p>
      <p>{blog.content}</p>

      {/* Show buttons only if logged-in user is the author */}
      {isAuthor && (
        <div className="blog-actions">
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
