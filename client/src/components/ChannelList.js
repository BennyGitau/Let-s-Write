import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeProvider';

const ChannelList = ({ channels, onChannelSelect, onChannelJoin }) => {
  const { user } = useContext(AuthContext);
  const [hoveredChannelId, setHoveredChannelId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isDarkMode } = useTheme();
  const [leaveTimeout, setLeaveTimeout] = useState(null);

  const handleJoin = async (channelId) => {
    try {
      const response = await axios.post(
        '/channels/join',
        { channel_id: channelId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      if (response.status === 200) {
        onChannelJoin(channelId); 
        alert(`Joined channel ${channelId}`);
      }
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredChannels = channels.filter((channel) =>
    channel.channel_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMouseEnter = (commentId) => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      setLeaveTimeout(null);
    }
    setHoveredChannelId(commentId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredChannelId(null);
    }, 1000);
    setLeaveTimeout(timeout);
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'dark' : 'light'}`} style={{ maxHeight: '500px', overflow: 'auto' }}>
      <h2 className="text-2xl font-bold mb-4">Channels</h2>
      <form className="relative mb-4">
        <input
          type="text"
          placeholder="Find channel..."
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon 
          icon={faSearch} 
          className="absolute right-3 top-1/2  transform -translate-y-1/2 text-gray-400"
        />
      </form>
      <ul className="space-y-2 mb-4 overflow-auto">
        {filteredChannels.map((channel) => (
          <li
            key={channel.id}
            className={`relative group cursor-pointer transition-colors duration-200 font-semibold text-lg flex justify-between items-start ${isDarkMode ? 'text-blue-300 hover:text-blue-500' : 'text-blue-500 hover:text-blue-700'}`}
            onMouseEnter={() => handleMouseEnter(channel.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => onChannelSelect(channel.id)}
          >
            <div className="flex items-center">
              <span className="mr-1">@</span>{channel.channel_name}
            </div>
            {hoveredChannelId === channel.id && (
              <button
              className={`absolute top-full mt-1 border rounded-md shadow-lg p-1 z-10 text-white bg-green-400 ${isDarkMode ? ' dark hover:bg-green-600 border-gray-600' : 'light hover:bg-green-400 border-gray-300'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(channel.id);
                  }}
                >
                  Join
                </button>
              
            )}
          </li>
        ))}
      </ul>
      <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition-all duration-200 ">
        <Link to="/create-channel" className="no-underline">
          Create Channel
        </Link>
      </button>
    </div>
  );
};

export default ChannelList;

