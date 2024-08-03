import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Pagination, Form, Button } from "react-bootstrap";
import './Search.css';
import GameCard from '../../components/GameCard';
import { categories, genres, sortBys } from './data';

function Search() {

    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useState(new URLSearchParams());
    const itemsPerPage = 24;

    const searchFormRef = useRef(null);

    // navigations
    const goToHome = () => {
        sessionStorage.removeItem('username')
        navigate('/')
    }


    const goToFavorites = () => navigate('/favorites')
    const goToGameHub = () => navigate('/gamehub')


    const fetchGames = useCallback((params) => {
        const page = currPage;
        const offset = (page - 1) * itemsPerPage;

        params.set('limit', itemsPerPage);
        params.set('offset', offset);

        fetch(`http://localhost:8801/games?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => {
                setGames(data.games);
                const newTotalPages = Math.ceil(data.total / itemsPerPage);
                if (totalPages !== newTotalPages) {
                    setTotalPages(newTotalPages);
                }
            })
            .catch((error) => { console.error('Error fetching games:', error) });
    }, [currPage, itemsPerPage, totalPages]);


    useEffect(() => {
        fetchGames(searchParams);
    }, [currPage, fetchGames, searchParams]);


    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currPage) {
            setCurrPage(pageNumber);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target)
        const payLoad = Object.fromEntries(formData)
        const newSearchParams = new URLSearchParams();

        const minPrice = parseFloat(payLoad.minPrice) || 0;
        const maxPrice = parseFloat(payLoad.maxPrice) || Infinity;
        if (minPrice > maxPrice) {
            alert('Max price should be greater than or equal to Min price');
            return;
        }

        if (payLoad.name) newSearchParams.append('name', payLoad.name);
        if (payLoad.genre) newSearchParams.append('genre', payLoad.genre);
        if (payLoad.category) newSearchParams.append('category', payLoad.category);
        if (payLoad.sortBy) newSearchParams.append('sortBy', payLoad.sortBy);
        if (payLoad.minPrice) newSearchParams.append('minPrice', payLoad.minPrice);
        if (payLoad.maxPrice) newSearchParams.append('maxPrice', payLoad.maxPrice);

        setSearchParams(newSearchParams);
        setCurrPage(1);
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

    const handleAllClick = () => {
        setSearchParams(new URLSearchParams());
        setCurrPage(1);
        searchFormRef.current.reset()
    }

    return (
        <div className='container'>

            <Row >
                <Col xs="auto" className="text-left" >
                    <Button onClick={goToHome} className="home-button" variant="secondary">
                        Back to Home
                    </Button>
                </Col>
                <Col className="text-center" >
                    <h2>Welcome to the GameHub!</h2>
                    <p>Here you can access all your favorite games.</p>
                </Col>
                <Col xs="auto" className="text-right" >
                    <Button onClick={goToFavorites} className="favorite-button" variant="secondary">
                        My Favorites
                    </Button>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs="auto" className="d-flex align-items-center">
                    <h3>Search Below</h3>
                    <Button onClick={goToGameHub} className="topTen-button" variant="primary" style={{ marginLeft: '10px' }}>
                        Top Tens
                    </Button>
                </Col>
            </Row>

            <Row>
                <Form ref={searchFormRef} onSubmit={handleSearch}>
                    <Row className="justify-content-center">
                        <Col md={6} className="d-flex align-items-center">
                            <Form.Control
                                name='name'
                                type="text"
                                placeholder="Search by name"
                                className="formControl"
                            />
                            <Button type="submit" variant="primary">Search</Button>
                            <Button onClick={handleAllClick} className="All-Games" variant="primary" style={{ marginLeft: '10px' }}>
                                All
                            </Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs='auto' className="d-flex align-items-center">
                            <Form.Control
                                name="minPrice"
                                type="number"
                                min="0"
                                placeholder="Min Price"
                                className="formControl"
                            />
                            <Form.Control
                                name="maxPrice"
                                type="number"
                                min="0"
                                placeholder="Max Price"
                                className="formControl"
                            />
                            <Form.Select name="genre" className="formControl">
                                <option value="">Genres...</option>
                                {genres.map(genre =>
                                    <option value={genre} key={genre}>{genre}</option>
                                )}
                            </Form.Select>
                            <Form.Select name="category" className="formControl">
                                <option value="">Categories...</option>
                                {categories.map(categ =>
                                    <option value={categ} key={categ}>{categ}</option>
                                )}
                            </Form.Select>
                            <Form.Select name="sortBy" className="formControl">
                                <option value="">Sort by...</option>
                                {sortBys.map(op => (
                                    <React.Fragment key={op}>
                                        <option value={`${op} ASC`}>{`${op} ↑`}</option>
                                        <option value={`${op} DESC`}>{`${op} ↓`}</option>
                                    </React.Fragment>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </Form>
            </Row >

            <Row>
                <div className="games-grid">
                    {games.length > 0 ? (
                        games.map((game) => (
                            <GameCard key={game.AppId} game={game} />
                        ))
                    ) : (
                        <div className='no-games'>
                            <p>No games found. Try adjusting searching for something else.</p>
                        </div>
                    )}
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
        </div >
    )
}

export default Search;