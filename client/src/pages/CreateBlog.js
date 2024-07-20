import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider'; 

const AddBlog = () => {
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  const { channel_id } = useParams(); 
  const { isDarkMode } = useTheme(); 

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/blogs', 
        { 
          content: content, 
          title: title,
          topic: topic,
          channel_id: channel_id
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      if (response.status === 201) {
        navigate(`/dashboard`); // Navigate to blog list page after successful creation
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto mt-8 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-2xl font-semibold mb-4">Add a New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            required
          />
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-medium">Topic</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            rows="8"
            required
          />
        </div>
        <button
          type="submit"
          className='bg-green-600 hover:bg-green-700 p-1 text-white px-5 rounded transition-all duration-200 mt-2'
        >
          Add Blog
        </button>
      </form>
      <button className='bg-red-600 hover:bg-red-700 p-1 text-white px-7 rounded transition-all duration-200 mt-2'>
        <Link to={`/dashboard`}>Cancel</Link>
      </button>
    </div>
  );
};

export default AddBlog;

