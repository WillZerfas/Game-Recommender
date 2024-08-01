import React, { useState } from 'react';
import './Signup.css';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

function Signup() {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [message, setMessage] = useState(''); // State for holding the message
  const [isChecking, setIsChecking] = useState(false); // State for loading indicator
  const navigate = useNavigate(); 
  // Function to check if a username or email already exists in the database
  const checkUserExists = async () => {
    setIsChecking(true);
    try {
      // Use Axios to send a GET request to the server
      const response = await Axios.get('http://localhost:8801/check-user', {
        params: { username: usernameReg, email: emailReg }, // Pass username and email as query parameters
      });

      setMessage(response.data.message); // Set the message from the server response
      setIsChecking(false); // Set loading state to false
      return response.data.available; // Return availability status
    } catch (error) {
      // Handle errors
      setMessage('An error occurred while checking user.');
      setIsChecking(false);
      return false; // Assume not available if there's an error
    }
  };

  // Function to handle registration
  const register = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const isAvailable = await checkUserExists(); // Await checkUserExists to complete
    if (!isAvailable) {
      // Exit if username or email already exists
      return;
    }

    try {
      // Use Axios to send a POST request to the server with registration data
      const response = await Axios.post('http://localhost:8801/register', {
        email: emailReg,
        username: usernameReg,
        password: passwordReg,
      });
      setMessage(response.data.message); // Set success message
      navigate('/gamehub');
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        setMessage(error.response.data.message); // Set error message from server response
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={register}>
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            value={usernameReg}
            onChange={(e) => setUsernameReg(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            value={emailReg}
            onChange={(e) => setEmailReg(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            value={passwordReg}
            onChange={(e) => setPasswordReg(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-button" disabled={isChecking}>
          {isChecking ? 'Checking...' : 'Sign Up'}
        </button>
        {message && <p style={{ fontSize: '14px', color: 'red' }} className="signup-message">{message}</p>} {/* Display message */}
        <div>
          <p style={{ fontSize: '14px', color: 'gray' }}>
            Already have an account?
            <Link to="/login"> Login </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
