// src/components/GameCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game }) {
  const navigate = useNavigate();

  const handleExpand = () => {
    navigate(`/gameDetails/${game.AppId}`);
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
      </Card.Body>
    </Card>
  );
}

export default GameCard;
