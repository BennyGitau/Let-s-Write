import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ChannelList from './ChannelList';
import BlogList from './BlogList';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider';

const Dashboard = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('1');
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get('/channels', {
        headers:{
          Authorization: `Bearer ${user.token}`,
        } 
      });
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  const handleChannelJoin = async (channelId) => {
    try {
    //add join logic
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };
  return (
    <div className="flex h-screen  mt-0">
      <div className={`w-1/5 p-4 fixed h-full ${isDarkMode ? 'dark bg-black' : 'light'}`}>
        <ChannelList 
          channels={channels} 
          onChannelSelect={handleChannelSelect} 
          onChannelJoin={handleChannelJoin}
        />
      </div>
      <div className="w-4/5 p-4 ml-[20%] h-full">
        {selectedChannel && <BlogList channelId={selectedChannel} />}
      </div>
    </div>
  );
};

export default Dashboard;
