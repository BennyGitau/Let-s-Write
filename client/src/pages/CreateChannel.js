import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link  } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateChannel = () => {
  const navigate = useNavigate();
  const [channelName, setChannelName] = useState('');
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    setChannelName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    const response = await axios.post('/channels', { channel_name: channelName }, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
      if (response.status === 201) {
        navigate(`/channels/${response.data.id}/create-blog`);
      }
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  return (
<div className="container mx-auto px-4 py-8 max-w-lg bg-white rounded-sm shadow-md mt-5">
  <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Channel</h2>
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label htmlFor="channelName" className="block text-sm font-medium text-white">
        Channel Name
      </label>
      <input
        type="text"
        id="channelName"
        name="channelName"
        value={channelName}
        onChange={handleChange}
        className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter channel name"
        required
      />
    </div>
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
    >
      Create Channel
    </button>
  </form>
  <div className="mt-4 text-center">
    <button className="w-full bg-red-800 hover:bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300">
      <Link to="/dashboard">Cancel</Link>
    </button>
  </div>
</div>

  );
};

export default CreateChannel;
