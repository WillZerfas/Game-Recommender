import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameHub.css';
import GameCard from '../../components/GameCard';
import axios from 'axios';
import { Row, Col, Button, Container } from 'react-bootstrap';

function GameHub() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('');

  // Function to handle navigation to home
  const goToHome = () => {
    navigate('/'); // Navigate to Home page
  };

  // get stored username, check if exists in db, if not return to login page
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      axios.get(`http://localhost:8801/check-user?username=${storedUsername}`)
        .then(response => {
          if (response.data.exists) {
            setUsername(storedUsername);
          } else {
            sessionStorage.removeItem('username');
            navigate('/login'); // Redirect to login if user does not exist
          }
        })
        .catch(error => {
          console.error('Error verifying user:', error);
          navigate('/login'); // Redirect to login on error
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate('/login'); // Redirect to login if username is not found
      setLoading(false);
    }
  }, [navigate]);



  /**
   * HAVE TO ADD TO .CSS FILE 
   */
  return (
    loading ? (
      <div>Loading...</div>
    ) : (
      <Container>
        <Row>
          <Col>
            <h2>Welcome to the GameHub!</h2>
            <p>Here you can access all your favorite games.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" className="me-2" onClick={() => { setView('search') }}>
              Search for Games
            </Button>
            <Button variant="danger" className="me-2" onClick={goToHome}>
              My Favorites
            </Button>
            <Button variant="danger" onClick={goToHome}>
              Logout
            </Button>
          </Col>
        </Row>
        <Row>
          {view === 'search' && (
            <Container>
              <Col>
                <Row>
                  <p>searches</p>
                </Row>
              </Col>
              <Col>
                <Row>
                  <p>game cards</p>
                </Row>
              </Col>
            </Container>
          )}
          {view === 'favorites' && (
            <Col>
              <Row>
                <p>My favorite games here</p>
              </Row>
            </Col>
          )}
        </Row>
      </Container>
    )
  );
}

export default GameHub;