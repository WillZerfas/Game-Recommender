import React, { useState, useEffect } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State to hold messages
  const navigate = useNavigate(); // Initialize useNavigate


  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8801/login', {
        username: username,
        password: password,
      });

      if (response.data === 'Login Successful') {
        setMessage('Login Successful!');
        // Redirect to GameHub after successful login
        navigate('/gamehub');
      } else {
        setMessage('Invalid username or password.');
      }
    } catch (error) {
      setMessage('An error occurred during login.');
      console.log('Error:', error);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        {message && <p style={{ fontSize: '14px', color: 'red' }} className="login-message">{message}</p>} {/* Display message */}
        <div>
          <p style={{ fontSize: '14px', color: 'gray' }}>
            Don't have an account?
            <Link to="/signup"> Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
