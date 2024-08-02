import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Pagination, Form, Button, Container } from "react-bootstrap";
import './Search.css';
import GameCard from '../../components/GameCard';

function Search() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 24;

    const [searchText, setSearchText] = useState('');
    const [genre, setGenre] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('');

    // navigations
    const goToHome = () => {
        sessionStorage.removeItem('username')
        navigate('/')
    }
    const goToFavorites = () => navigate('/favorites')
    const goToGameHub = () => navigate('/gamehub')

    useEffect(() => {
        fetchGames(currPage);
    }, [currPage]);

    const fetchGames = (page) => {
        const offset = (page - 1) * itemsPerPage;
        fetch(`http://localhost:8801/games?limit=${itemsPerPage}&offset=${offset}`)
            .then((response) => response.json())
            .then((data) => {
                setGames(data.games);
                const newTotalPages = Math.ceil(data.total / itemsPerPage);
                if (totalPages !== newTotalPages) {
                    setTotalPages(newTotalPages);
                }
            })
            .catch((error) => { console.error('Error fetching games:', error) });
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currPage) {
            setCurrPage(pageNumber);
        }
    };

    const buildPaginator = () => {
        let items = [];
        const maxPageButtons = 5;
        const halfPageButtons = Math.floor(maxPageButtons / 2);
        let startPage = currPage - halfPageButtons;
        let endPage = currPage + halfPageButtons;
        if (startPage <= 1) {
            endPage = Math.min(totalPages, endPage + (1 - startPage));
            startPage = 1;
        }
        if (endPage >= totalPages) {
            startPage = Math.max(1, startPage - (endPage - totalPages));
            endPage = totalPages;
        }
        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currPage} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }
        return items;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrPage(1);
        //todo search for the games
    };

    return (
        <div className="Search-container">
            <Row>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Button onClick={goToHome} className="home-button" variant="secondary">
                        Back to Home
                    </Button>
                    <Button onClick={goToFavorites} className="favorite-button" variant="secondary">
                        My Favorites
                    </Button>
                </div>
            </Row>
            <Row className="justify-content-center">
                <h2>Welcome to the GameHub!</h2>
                <Col xs="auto">
                    <p>Here you can access all your favorite games.</p>
                </Col>
                <Col xs="auto">
                    <Button onClick={goToGameHub} className="topTen-button" variant="primary">
                        Top Tens
                    </Button>
                </Col>
            </Row>
            <Row><h1>Search Below</h1></Row>
            <Form onSubmit={handleSearch}>
                <Row className="mb-3">
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Search by name"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="">Sort by...</option>
                            <option value="releasedate">Release Date</option>
                            <option value="price">Price</option>
                            <option value="name">Name</option>
                            <option value="metascore">Metascore</option>
                            <option value="positive">Positive Reviews</option>
                            <option value="negative">Negative Reviews</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Button type="submit" variant="primary">Search</Button>
                    </Col>
                </Row>
            </Form>
            <Container className="games-grid">
                <Row>
                    {games.map((game) => (
                        <Col key={game.AppId} xs={12} sm={6} md={4} lg={3}>
                            <GameCard game={game} />
                        </Col>
                    ))}
                </Row>
            </Container>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(currPage - 1)}
                            disabled={currPage === 1}
                        />
                        {buildPaginator()}
                        <Pagination.Next
                            onClick={() => handlePageChange(currPage + 1)}
                            disabled={currPage === totalPages}
                        />
                    </Pagination>
                </Col>
            </Row>
        </div>
    )
}

export default Search;