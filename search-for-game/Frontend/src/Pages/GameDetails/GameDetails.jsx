import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './GameDetails.css'; // Optional CSS for styling

function GameDetails() {
  const { appId } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  useEffect(() => {
    // Fetch game details by AppId
    fetch(`http://localhost:8801/games/details/${appId}`)
      .then((response) => response.json())
      .then((data) => setGameDetails(data))
      .catch((error) => console.error('Error fetching game details:', error));
    
    // Fetch developers for the game by AppId
    fetch(`http://localhost:8801/games/developers/${appId}`)
      .then((response) => response.json())
      .then((data) => setDevelopers(data))
      .catch((error) => console.error('Error fetching developers:', error));

    // Fetch platforms for the game by AppId
    fetch(`http://localhost:8801/games/platforms/${appId}`)
      .then((response) => response.json())
      .then((data) => setPlatforms(data))
      .catch((error) => console.error('Error fetching platforms:', error));
  }, [appId]);

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
  };

  if (!gameDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="game-details-container">
      <Row>
        <Col md={4}>
          {/* Display game image if available */}
          {gameDetails.Image && <img src={gameDetails.Image} alt={gameDetails.Name} className="game-image" />}
        </Col>
        <Col md={8}>
          <h2>{gameDetails.Name}</h2>
          <p><strong>Price:</strong> ${gameDetails.Price}</p>
          <p>
            <strong>Platforms:</strong>
            {platforms.map((platform) => (
              <Button
                key={platform.PlatformID}
                variant="link"
                onClick={() => handlePlatformClick(platform)}
              >
                {platform.Platform}
              </Button>
            ))}
          </p>
          {selectedPlatform && (
            <div className="platform-description">
              <h4>{selectedPlatform.Platform}</h4>
              <p>{selectedPlatform.Description}</p>
            </div>
          )}
          <p>
            <strong>Developers: </strong>
            {developers.map((developer, index) => (
              <span key={developer.developer}>
                <a 
                  href={developer.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="developer-link"
                >
                  {developer.developer}
                </a>
                {index < developers.length - 1 && ', '}
              </span>
            ))}
          </p>
          <p><strong>Release Date:</strong> {gameDetails.ReleaseDate}</p>
          <p><strong>Description:</strong> {gameDetails.Description}</p>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default GameDetails;
