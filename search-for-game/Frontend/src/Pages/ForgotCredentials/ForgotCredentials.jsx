import React, { useState } from 'react';
import axios from 'axios';
import './ForgotCredentials.css';

function ForgotCredentials() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isResetPassword, setIsResetPassword] = useState(true); // Toggle between reset password and change username

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8801/forgot-password', {
        username,
        email,
        newPassword,
      });

      if (response.data.success) {
        setMessage('Password updated successfully.');
      } else {
        setMessage(response.data.error || 'Error updating password.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  const handleChangeUsername = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8801/change-username', {
        email,
        password,
        newUsername,
      });

      if (response.data.success) {
        setMessage('Username updated successfully.');
      } else {
        setMessage(response.data.error || 'Error updating username.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="forgot-credentials-container">
      <h2>Forgot Credentials</h2>
      <div className="toggle-buttons">
        <button
          onClick={() => setIsResetPassword(true)}
          className={isResetPassword ? 'active' : ''}
        >
          Reset Password
        </button>
        <button
          onClick={() => setIsResetPassword(false)}
          className={!isResetPassword ? 'active' : ''}
        >
          Change Username
        </button>
      </div>

      {isResetPassword ? (
        <form onSubmit={handleResetPassword} className="forgot-credentials-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="forgot-button">
            Reset Password
          </button>
        </form>
      ) : (
        <form onSubmit={handleChangeUsername} className="forgot-credentials-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newUsername">New Username:</label>
            <input
              type="text"
              placeholder="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="forgot-button">
            Change Username
          </button>
        </form>
      )}

      {message && <p className="forgot-message">{message}</p>}
    </div>
  );
}

export default ForgotCredentials;
