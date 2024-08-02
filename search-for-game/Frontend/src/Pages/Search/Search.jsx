import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Pagination, Form, Button } from "react-bootstrap";
import './Search.css';
import GameCard from '../../components/GameCard';

function Search() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 24;

    // navigations
    const goToHome = () => {
        sessionStorage.removeItem('username')
        navigate('/')
    }
    const goToFavorites = () => navigate('/favorites')
    const goToGameHub = () => navigate('/gamehub')

    const fetchGames = useCallback((page) => {
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
    }, [itemsPerPage, totalPages]);

    useEffect(() => {
        fetchGames(currPage);
    }, [currPage, fetchGames]);

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
        const formData = new FormData(e.target)
        const payLoad = Object.fromEntries(formData)
        //todo search for the games
        console.log(payLoad)
    };

    return (
        <div className='container'>

            <Row style={{ border: '1px solid red' }}>
                <Col xs="auto" className="text-left" >
                    <Button onClick={goToHome} className="home-button" variant="secondary">
                        Back to Home
                    </Button>
                </Col>
                <Col className="text-center" style={{ border: '1px solid red' }}>
                    <h2>Welcome to the GameHub!</h2>
                    <p>Here you can access all your favorite games.</p>
                </Col>
                <Col xs="auto" className="text-right" style={{ border: '1px solid red' }}>
                    <Button onClick={goToFavorites} className="favorite-button" variant="secondary">
                        My Favorites
                    </Button>
                </Col>
            </Row>

            <Row className="justify-content-center" style={{ border: '1px solid red' }}>
                <Col xs="auto" className="d-flex align-items-center" style={{ border: '1px solid red' }}>
                    <h3>Search Below</h3>
                    <Button onClick={goToGameHub} className="topTen-button" variant="primary" style={{ marginLeft: '10px' }}>
                        Top Tens
                    </Button>
                </Col>
            </Row>

            <Row>
                <Form onSubmit={handleSearch} style={{ border: '1px solid red' }}>
                    <Row className="justify-content-center">
                        <Col md={6} className="d-flex align-items-center">
                            <Form.Control
                                name='searchField'
                                type="text"
                                placeholder="Search by name"
                                className="formControl"
                            />
                            <Button type="submit" variant="primary">Search</Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs='auto' className="d-flex align-items-center">
                            <Form.Control
                                name="genre"
                                type="text"
                                placeholder="Genre"
                                className="formControl"
                            />
                            <Form.Control
                                name="category"
                                type="text"
                                placeholder="Category"
                                className="formControl"
                            />
                            <Form.Select
                                name="sortBy"
                                className="formControl"
                            >
                                <option value="">Sort by...</option>
                                <option value="releasedate">Release Date</option>
                                <option value="price">Price</option>
                                <option value="name">Name</option>
                                <option value="metascore">Metascore</option>
                                <option value="positive">Positive Review Num</option>
                                <option value="negative">Negative Review Num</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Form>
            </Row>

            <Row style={{ border: '1px solid red' }}>
                <div className="games-grid">
                    {games.map((game) => (
                        <GameCard key={game.AppId} game={game} />
                    ))}
                </div>
            </Row>

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