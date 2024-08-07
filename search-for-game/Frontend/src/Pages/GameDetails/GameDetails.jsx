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
      <Row style={{ margin: '15px 0px' }}>
        {/* Display game image if available */}
        {gameDetails.Image && <img src={gameDetails.Image} alt={gameDetails.Name} className="game-image" />}
      </Row>

      <Row>
        <h1>
          <span className='game-details-name'><strong>{gameDetails.Name}</strong></span>
        </h1>
      </Row>

      <Row>
        <Col md={4}>
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
        </Col>
        <Col md={4}>
          <h3>
            <strong>Release Date:</strong> {gameDetails.ReleaseDate}
          </h3>
        </Col>
        <Col md={4}>
          <h3>
            <span>Price: 💵 {gameDetails.Price} </span>
          </h3>
        </Col>
      </Row>

      <Row>
        <Col>
          <p>
            <span className="platform-buttons">
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
            </span>
            {selectedPlatform && (
              <span className='platform-descriptions'>
                <span>{selectedPlatform.Platform}: </span>
                <span>{selectedPlatform.Description}</span>
              </span>
            )}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className='game-description'><strong>Description:</strong> {gameDetails.Description}</p>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default GameDetails;
