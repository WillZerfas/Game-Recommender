import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './DeveloperUnavailable.css';

function DeveloperUnavailable() {
  const navigate = useNavigate();

  return (
    <Container className="developer-unavailable-container">
      <h1>Website Not Available</h1>
      <p>
        We're sorry, but the website for this developer is currently not available. Please try again later.
      </p>
      <Button variant="primary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Container>
  );
}

export default DeveloperUnavailable;
