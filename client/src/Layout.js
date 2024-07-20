import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useTheme } from "./context/ThemeProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate('/login'); // Navigate to the login page after logout
  };

  return (
    <div className={`min-h-screen mb-2 ${isDarkMode ? 'dark' : 'light'}`}>
      <nav className={`bg-blue-700 text-white shadow-md sticky top-0 ${isDarkMode ? 'dark-bg' : 'light-bg'}`}>
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/" className="brand text-2xl font-bold">
            Let's Write
          </Link>
          <button className="block lg:hidden focus:outline-none">
            <i className="fa fa-bars"></i>
          </button>
          <div className="hidden lg:flex lg:flex-grow lg:items-center lg:justify-end">
            <ul className="list-none flex space-x-4">
              {user ? (
                <>
                  <li className="nav-item">
                    <button className={`rounded-lg p-2 ${isDarkMode ? 'dark hover:bg-blue-500' : 'light hover:bg-blue-800'}`}>
                      <Link to="/profile" className="nav-link">Profile</Link>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`rounded-lg p-2 ${isDarkMode ? 'dark hover:bg-blue-500' : 'light hover:bg-blue-800'}`} id="logout" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button className={`rounded-lg p-3 m-2 ${isDarkMode ? 'dark hover:bg-blue-500' : 'light hover:bg-blue-800'}`}>
                      <Link to="/" className="w-full">Home</Link>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`rounded-lg p-3 m-2 ${isDarkMode ? 'dark hover:bg-blue-500' : 'light hover:bg-blue-800'}`}>
                    <Link to="/login" className={`nav-link ${isDarkMode ? 'dark-text' : 'light-text'}`}>Login</Link>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`rounded-lg p-3 m-2 ${isDarkMode ? 'dark hover:bg-blue-500' : 'light hover:bg-blue-800'}`}>
                    <Link to="/signup" className={`text-white  ${isDarkMode ? 'dark-text' : 'light-text'}`}>Register</Link>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="w-15 m-2">
            <button className={` text-white py-2 px-4 rounded-lg transition duration-200 ${isDarkMode ? 'dark hover:bg-yellow-300 text-' : 'light hover:bg-gray-400'}`} onClick={toggleTheme}>
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />  
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
