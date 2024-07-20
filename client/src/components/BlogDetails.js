import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CommentList from './Comment';

const BlogDetails = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext); 
  const [blog, setBlog] = useState(null); 

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        });
        setBlog(response.data); 
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };
  if (user) {
    fetchBlogDetails();
  }
    
  }, [id, user]); 


 
  return (
    <div className="container shadow-md rounded-sm mx-auto px-4 py-8">
      <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 mb-4 block">
        Dashboard
      </Link>

      {blog ? (
        <div className="bg-white p-6 rounded-sm shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{blog.title}</h2>
          <p className="text-gray-700">{blog.content}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <CommentList id={id} user={user}/>
    </div>
  );
};

export default BlogDetails;




