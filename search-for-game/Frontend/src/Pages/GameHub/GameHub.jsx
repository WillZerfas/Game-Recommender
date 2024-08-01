import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameHub.css';
import GameCard from '../../components/GameCard';
import axios from 'axios';

function GameHub() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle navigation to home
  const goToHome = () => {
    navigate('/'); // Navigate to Home page
  };

  // get stored username
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      axios.get(`http://localhost:8801/check-user?username=${storedUsername}`)
        .then(response => {
          if (response.data.exists) {
            setUsername(storedUsername);
          } else {
            sessionStorage.removeItem('username');
            navigate('/login'); // Redirect to login if user does not exist
          }
        })
        .catch(error => {
          console.error('Error verifying user:', error);
          navigate('/login'); // Redirect to login on error
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate('/login'); // Redirect to login if username is not found
      setLoading(false);
    }
  }, [navigate]);

  /**
   * HAVE TO ADD TO .CSS FILE 
   */
  return (
    loading ? (<div>Loading...</div>) :
      (
        <div className="gamehub-container">
          <button onClick={goToHome} className="home-button">
            Back to Home
          </button>
          <h2 className="">Welcome to the GameHub!</h2>
          <p className="">Here you can access all your favorite games.</p>
        </div>
      )
  );
}

export default GameHub;