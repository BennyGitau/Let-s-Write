
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios'

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

const login = async ({ username, password }) => {
  try {
    const response = await axios.post('/login', { username, password });
    const { access_token } = response.data;
    setUser({ username, token: access_token });
    localStorage.setItem('token', access_token); //// save token in local storage
    return response;
  } catch (error) {
    console.error('Login failed', error);
    if (error.response) {
      return error.response;  // Return the error response to be handled in the component
    } else {
      throw error;  // Rethrow the error if it's not an HTTP error
    }
  }
};

const register = async ({ username, email, password }) => {
  try {
    const response = await axios.post('/users', { username, email, password });
    const { access_token } = response.data;
    setUser({ username, token: access_token });
    localStorage.setItem('token', access_token); // Store token in localStorage

    return response;
  } catch (error) {
    console.error('Registration failed', error);
    if (error.response) {
      return error.response;  // Return the error response to be handled in the component
    } else {
      throw error;  // Rethrow the error if it's not an HTTP error
    }
  }
};

  const patchUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      };
      const response = await axios.patch('/users', userData, { headers });
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const logout = () => {
    
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage on logout

  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, patchUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthContext};
