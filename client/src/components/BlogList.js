import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider';

const BlogList = ({ channelId }) => {
  const [blogs, setBlogs] = useState([]);
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchBlogs();
  }, [channelId]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`/blogs_by_channel_id/${channelId}`, {
        headers:  {
          Authorization: `Bearer ${user.token}`,
        } 
      });
      setBlogs(response.data);
      //console.log(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  return (
<div className="container mx-auto px-4 py-8 overflow-y-auto h-530">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Latest Blogs</h2>
    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300">
      <Link to={`/channels/${channelId}/create-blog`} className="no-underline">
        Create Blog
      </Link>
    </button>
  </div>
  <ul className="space-y-6">
    {blogs.map((blog) => (
      <li key={blog.id} className="p-4 bg-white dark:bg-gray-800 rounded-sm shadow-sm transition duration-300">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{blog.topic}</h3>
        <p className="text-gray-700">{blog.title}</p>
        <div className="mt-4">
          <Link
            to={`/blogs/${blog.id}`}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
          >
            Read More
          </Link>
        </div>
      </li>
    ))}
  </ul>
</div>

  );
};

export default BlogList;
