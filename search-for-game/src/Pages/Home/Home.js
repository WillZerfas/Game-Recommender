import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to My App</h1>
      <div className="action-buttons">
        <Link to="/signup" className="home-button">
          Sign Up
        </Link>
        <Link to="/login" className="home-button">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
