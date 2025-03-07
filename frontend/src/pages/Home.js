import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./Home.css";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs`);
        setBlogs(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="home-container">
      <h3 className="home-page-head">🔰 Write, Explore, Inspire – One Blog at a Time!</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="blogs-list">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <h3>{blog.title}</h3>
                {/* If author is an object, access the 'name' property */}
                <p>
                  <strong>By:</strong> {blog.author.name} {/* Access author.name */}
                </p>
                <p>{blog.content.substring(0, 100)}...</p> {/* Show preview */}
                <Link to={`/blogs/${blog._id}`} className="read-more">
                  Read More
                </Link>
              </div>
            ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
