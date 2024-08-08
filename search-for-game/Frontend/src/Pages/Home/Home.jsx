import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const [avgPrice, setAvgPrice] = useState(0);
  const [gamesBelowAverage, setGamesBelowAverage] = useState(0);

  useEffect(() => {
    // Fetch average price
    fetch('http://localhost:8801/average-price')
      .then((response) => response.json())
      .then((data) => setAvgPrice(Number(data.avg_price) || 0))
      .catch((error) => console.error('Error fetching average price:', error));

    // Fetch count of games below average price
    fetch('http://localhost:8801/games-below-average')
      .then((response) => response.json())
      .then((data) => setGamesBelowAverage(Number(data.games_below_average) || 0))
      .catch((error) => console.error('Error fetching games below average:', error));
  }, []);

  return (
    <div className="home-container">
      <div className="title">Game Recommender</div>
      <h1>Welcome, We hope you find a game you enjoy!</h1>
      <div className="price-info">
        <p>We can show you a vast selection of games where the average price is only: ${avgPrice.toFixed(2)}</p>
        <p>And we have {gamesBelowAverage} games under that price!</p>
      </div>
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
