import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './GameHub.css';

function GameHub() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Fetch the 10 most popular games
    fetch('http://localhost:8801/games/popular')
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch((error) => console.error('Error fetching games:', error));
  }, []);

  // Function to handle navigation to home
  const goToHome = () => {
    navigate('/'); // Navigate to Home page
  };

  return (
    <div className="gamehub-container">
      <Button onClick={goToHome} className="home-button" variant="secondary">
        Back to Home
      </Button>
      <h2>Welcome to the GameHub!</h2>
      <p>Here you can access all your favorite games.</p>
      <div className="games-grid">
        {games.map((game) => (
          <Card key={game.Name} style={{ width: '18rem', margin: '1rem' }}>
            <Card.Img variant="top" src={game.Image} alt={game.Name} />
            <Card.Body>
              <Card.Title>{game.Name}</Card.Title>
              <Card.Text>
                Price: ${game.Price}
              </Card.Text>
              <Button variant="primary">Expand</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GameHub;