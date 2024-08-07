// src/components/GameCard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game, refreshFavorites }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [hover, setHover] = useState(false);
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

  const getFavoriteCount = useCallback(() => {
    fetch(`http://localhost:8801/game-favorite-count?appid=${game.AppId}`)
      .then(response => response.json())
      .then(data => {
        setFavoriteCount(data.TotalFavorites || 0);
      })
      .catch(error => {
        console.error('Error fetching favorite count:', error);
      });
  }, [game.AppId]);

  useEffect(() => {
    getFavoriteCount();
  }, [getFavoriteCount]);

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
          getFavoriteCount();
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
          getFavoriteCount();
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
        <Card.Text className='game-favorite-count'>
          Favorited by: {favoriteCount} users
        </Card.Text>
        <Button variant="primary" onClick={handleExpand}>Expand</Button>
        <Button
          variant={isFavorite ? "warning" : "secondary"}
          onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ margin: '10px' }}
        >
          {isFavorite ? '❤️' : (hover ? '💖' : '🤍')}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default GameCard;
