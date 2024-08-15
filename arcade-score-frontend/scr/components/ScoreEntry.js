import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ScoreEntry.css'; // Assuming you have a CSS file for styles

function ScoreEntry() {
    const location = useLocation();
    const { gameId, gameName } = location.state; // Retrieve game ID and name from state
    const [username, setUsername] = useState('');
    const [score, setScore] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://192.168.24.149:3001/score-entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ game_id: gameId, username, score }),
            });

            if (response.ok) {
                alert(`Score entry for ${gameName} added successfully`);
            } else {
                alert('Failed to add score entry');
            }
        } catch (error) {
            console.error('Error submitting score', error);
            alert('Failed to add score entry');
        }
    };

    return (
        <div className="score-entry-container">
            <nav className="navbar">
                <div className="navbar-brand">Arcade Score App</div>
                <div className="navbar-links">
                    <a href="/games">Games</a>
                    <a href="/scores">Scores</a>
                    <a href="/login">Logout</a>
                </div>
            </nav>
            <div className="content">
                <h2>Submit Score for {gameName}</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: '10px', margin: '10px', width: '200px' }}
                />
                <input
                    type="number"
                    placeholder="Score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    style={{ padding: '10px', margin: '10px', width: '200px' }}
                />
                <br />
                <button onClick={handleSubmit} style={{ padding: '10px 20px', marginTop: '20px' }}>Submit Score</button>
            </div>
        </div>
    );
}

export default ScoreEntry;
