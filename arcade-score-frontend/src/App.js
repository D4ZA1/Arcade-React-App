import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import GameSelection from './components/GameSelection';
import ScoreEntry from './components/ScoreEntry';
import Scores from './components/Scores';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/games" element={<GameSelection />} />
                <Route path="/score-entry" element={<ScoreEntry />} />
                <Route path={"/scores"} element={<Scores />}/>
            </Routes>
        </Router>
    );
}

export default App;
