import React, { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './TopRatioGames.css';

function TopRatioGames() {
  const [topRatioGames, setTopRatioGames] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch('http://localhost:8801/top-ratio')
      .then((response) => response.json())
      .then((data) => {
        // Ensure Ratio is a number
        const gamesWithRatio = data.map(game => ({
          ...game,
          Ratio: parseFloat(game.Ratio) || 0 // Convert Ratio to a number and default to 0 if conversion fails
        }));
        setTopRatioGames(gamesWithRatio);
      })
      .catch((error) => console.error('Error fetching games:', error));
  }, []);

  const goToGameHub = () => {
    navigate('/gamehub');
  };
  return (
    <div className="top-ratio-games-container">
        <Button 
        variant="secondary" 
        className="back-button"
        onClick={goToGameHub}
      >
        Back to GameHub
      </Button>
      <h1>Top Like to Disliked Games</h1>
      <div className="games-grid">
        {topRatioGames.length === 0 ? (
          <p>Loading...</p>
        ) : (
          topRatioGames.map((game) => (
            <div key={game.AppId} className="game-card-wrapper">
              <p className="ratio-text">Ratio: {game.Ratio.toFixed(2)}</p>
              <GameCard game={game} ratio={game.Ratio} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TopRatioGames;
