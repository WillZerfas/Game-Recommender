import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import './GameHub.css';
import GameCard from '../../components/GameCard';

function GameHub() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  // navigations
  const goToHome = () => {
    sessionStorage.removeItem('username');
    navigate('/');
  };
  const goToFavorites = () => navigate('/favorites');
  const goToSearch = () => navigate('/search');

  useEffect(() => {
    // Fetch the 10 most popular games
    fetch('http://localhost:8801/games/popular')
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch((error) => console.error('Error fetching games:', error));
  }, []);

  const goToTopRatioGames = () => {
    navigate('/top-ratio');
  };

  return (
    <div className="gamehub-container">

      <Row >
        <Col xs="auto" className="text-left" >
          <Button onClick={goToHome} className="home-button" variant="secondary">
            Back to Home
          </Button>
        </Col>
        <Col className="text-center" >
          <h2>Welcome to the GameHub!</h2>
          <p>Here you can access all your favorite games.</p>
        </Col>
        <Col xs="auto" className="text-right">
          <Button onClick={goToFavorites} className="favorite-button" variant="secondary">
            My Favorites
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs="auto" className="d-flex align-items-center">
          <h3>Top Tens</h3>
          <Button onClick={goToSearch} className="topTen-button" variant="primary" style={{ marginLeft: '10px' }}>
            Search for Games!
          </Button>
        </Col>
        <Col xs="auto">
          <Button onClick={goToTopRatioGames} className="top-ratio-button" variant="primary">
            Show Highest Like-to-Dislike Ratio Games
          </Button>
        </Col>
      </Row>

      <div className="games-grid">
        {games.map((game) => (
          <GameCard key={game.AppId} game={game} />
        ))}
      </div>
    </div>
  );
}

export default GameHub;
