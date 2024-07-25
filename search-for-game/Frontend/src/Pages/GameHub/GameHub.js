import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameHub.css';

function GameHub() {
  const navigate = useNavigate();

  // Function to handle navigation to home
  const goToHome = () => {
    navigate('/'); // Navigate to Home page
  };

  /**
   * HAVE TO ADD TO .CSS FILE 
   */
  return (
    <div className="gamehub-container">
      <button onClick={goToHome} className="home-button">
        Back to Home
      </button>
      <h2 className="">Welcome to the GameHub!</h2>
      <p className="">Here you can access all your favorite games.</p>
    </div>
  );
}

export default GameHub;