import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username: formData.username, password: formData.password });
      if (response.status === 200) {
        navigate('/dashboard');
      } else {
        alert(response.data.message || 'Login failed.');
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className='align-middle w-full'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-form-button bg-green-400 hover:bg-green-600">
          Login
        </button>
      </form>
      <button
        onClick={() => navigate('/signup')}
        className="auth-form-toggle bg-blue-500 hover:bg-blue-700"
      >
        No account? Sign up
      </button>
    </div>
  );
};

export default Login;
