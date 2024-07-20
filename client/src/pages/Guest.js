import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';

const Guest = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`max-h-screen  mt-11 flex items-center justify-center ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="p-16 rounded-sm shadow-2xl text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Welcome to <span className="text-blue-500 text-5xl rounded underline ">Let's Write</span></h1>
        <p className={`text-gray-600 mb-8 text-xl leading-relaxed ${isDarkMode ? 'dark' : 'light'}`}>
          Discover amazing content and connect with the community. Please sign up or log in to get started!
        </p>
        <div className="button-container flex justify-around mt-8">
          <Link to="/signup" className="btn bg-blue-500 text-white py-3 px-8 rounded-full shadow-md hover:bg-blue-600 transition duration-300 text-xl">
            Sign Up
          </Link>
          <Link to="/login" className="btn bg-green-500 text-white py-3 px-8 rounded-full shadow-md hover:bg-green-600 transition duration-300 text-xl">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Guest;

