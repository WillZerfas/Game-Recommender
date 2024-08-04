import './Favorites.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from "react-bootstrap";
import GameCard from '../../components/GameCard';

function Favorites() {

    const [games, setGames] = useState([]);
    const navigate = useNavigate()

    const goToHome = () => {
        sessionStorage.removeItem('username')
        navigate('/')
    }
    const goToSearch = () => navigate('/search')
    const goToGameHub = () => {
        navigate('/gamehub'); // Navigate to Home page
    };

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        if (username) {
          fetch(`http://localhost:8801/favorites-by-username?username=${username}`)
            .then(response => response.json())
            .then(data => {
                console.log(games)
                setGames(data)
            })
            .catch(error => console.error('Error fetching favorite games:', error))
        } else {
            alert('Couldn\'t find your username, try logging in again.')
        }
      }, []);

    return (
        <div className='favorites-container'>
            <Row >
                <Col xs="auto" >
                    <Button onClick={goToHome} className="home-button" variant="secondary">
                        Back to Home
                    </Button>
                </Col>
                <Col className="text-center" >
                    <h2>Welcome to the GameHub!</h2>
                    <p>Here you can access all your favorite games.</p>
                </Col>
                <Col xs="auto" >
                    <Button onClick={goToGameHub} className="favorite-button" variant="secondary">
                        GameHub
                    </Button>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs="auto" className="d-flex align-items-center">
                    <h3>My Favorite</h3>
                    <Button onClick={goToSearch} className="topTen-button" variant="primary" style={{ marginLeft: '10px' }}>
                        Search for more!
                    </Button>
                </Col>
            </Row>

            <Row>
                <div className="games-grid">
                    {games.length > 0 ? (
                        games.map((game) => (
                            <GameCard key={game.AppId} game={game} />
                        ))
                    ) : (
                        <div className='fav-no-games'>
                            <p>No favorite games yet, find some great games in search!</p>
                        </div>
                    )}
                </div>
            </Row>

        </div>
    );

}

export default Favorites;