import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Layout from '../Layout';
import Login from './Login';
import SignUp from './SignUp';
import Profile from '../pages/Profile';
import Dashboard from './Dashboard';
import BlogDetails from './BlogDetails';
import BlogList from './BlogList';
import ChannelList from './ChannelList';
import CreateChannel from '../pages/CreateChannel';
import AddBlog from '../pages/CreateBlog';
import Guest from '../pages/Guest';
import ErrorPage from '../pages/ErrorHandler';


const App = () => {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Guest />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/channels/:channel_id/blogs" element={<BlogList />} />
            <Route path="channels" element={<ChannelList />} />
            <Route path="blogs/:id" element={<BlogDetails />} />
            <Route path="create-channel" element={<CreateChannel />} />
            <Route path="channels/:channel_id/create-blog" element={<AddBlog />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

