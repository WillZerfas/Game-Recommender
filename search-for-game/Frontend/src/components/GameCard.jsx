// src/components/GameCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './GameCard.css';

function GameCard({game}) {

    return (
        <Card className="game-card">
            <Card.Img className="game-image" variant="top" src={game.Image} alt={game.Name} />
            <Card.Body>
                <Card.Title className="game-title">{game.Name}</Card.Title>
                <Card.Text className="game-price">
                    Price: ${game.Price}
                </Card.Text>
                <Button variant="primary">Expand</Button>
            </Card.Body>
        </Card>
    );
}

export default GameCard;