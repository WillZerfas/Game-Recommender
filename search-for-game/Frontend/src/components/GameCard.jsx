// src/components/GameCard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game, refreshFavorites }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleExpand = () => {
    navigate(`/gameDetails/${game.AppId}`);
  };

  // check if card is favored by user
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username) {
      fetch(`http://localhost:8801/check-favorite?username=${username}&appId=${game.AppId}`)
        .then(response => response.json())
        .then(data => {
          if (data.isFavorite) {
            setIsFavorite(true);
          }
        })
        .catch(error => {
          console.error('Error checking favorite status:', error);
        });
    }
  }, [game.AppId]);

  const handleAddToFavorites = () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      return;
    }
    fetch('http://localhost:8801/add-to-favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, appId: game.AppId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsFavorite(true);
        }
      })
      .catch(error => {
        console.error('Error adding game to favorites:', error);
      });
  };

  const handleRemoveFromFavorites = () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      return;
    }
    fetch('http://localhost:8801/remove-from-favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, appId: game.AppId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsFavorite(false);
          if (refreshFavorites) {
            refreshFavorites(); // Refresh the list for favorites page
          }
        }
      })
      .catch(error => {
        console.error('Error removing game from favorites:', error);
      });
  };

  return (
    <Card className="game-card">
      <Card.Img className="game-image" variant="top" src={game.Image} alt={game.Name} />
      <Card.Body>
        <Card.Title className="game-title">{game.Name}</Card.Title>
        <Card.Text className="game-price">
          Price: ${game.Price}
        </Card.Text>
        <Button variant="primary" onClick={handleExpand}>Expand</Button>
        <Button
          variant={isFavorite ? "danger" : "secondary"}
          onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
          style={{ margin: '5px' }}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default GameCard;
