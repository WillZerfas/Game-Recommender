import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import GameHub from './Pages/GameHub/GameHub';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  useEffect(() => {
    fetch('http://localhost:8801/user')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }, [])
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/gamehub" element={<GameHub />} /> 
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
