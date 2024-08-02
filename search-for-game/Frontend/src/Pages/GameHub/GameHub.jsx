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
    sessionStorage.removeItem('username')
    navigate('/')
  }
  const goToFavorites = () => navigate('/favorites')
  const goToSearch = () => navigate('/search')

  useEffect(() => {
    // Fetch the 10 most popular games
    fetch('http://localhost:8801/games/popular')
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch((error) => console.error('Error fetching games:', error));
  }, []);

  return (
    <div className="gamehub-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button onClick={goToHome} className="home-button" variant="secondary">
          Back to Home
        </Button>
        <Button onClick={goToFavorites} className="favorite-button" variant="secondary">
          My Favorites
        </Button>
      </div>
      <Row className="justify-content-center">
        <h2>Welcome to the GameHub!</h2>
        <Col xs="auto">
          <p>Here you can access all your favorite games.</p>
        </Col>
        <Col xs="auto">
          <Button onClick={goToSearch} className="search-button" variant="primary">
            Search for Games!
          </Button>
        </Col>
      </Row>
      <h1>Top Tens</h1>
      <div className="games-grid">
        {games.map((game) => (
          <GameCard key={game.AppId} game={game} />
        ))}
      </div>
    </div>
  )
}

export default GameHub;