
// frontend/src/components/ScoreEntry.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ScoreEntry.css';
import BACK_URL from '../config';

function ScoreEntry() {
  const location = useLocation();
  const { gameId, gameName } = location.state || {};
  const [name, setName] = useState('');
  const [rollno, setRollno] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedRollno = rollno.trim();
    const numericScore = Number(score);

    if (!gameId || !trimmedName || !trimmedRollno || isNaN(numericScore)) {
      alert('Please fill all fields correctly');
      console.log('Validation failed:', { gameId, trimmedName, trimmedRollno, score });
      return;
    }

    console.log('Submitting score entry:', {
      game_id: gameId,
      name: trimmedName,
      rollno: trimmedRollno,
      score: numericScore,
    });

    try {
      const response = await fetch(`${BACK_URL}/score-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: gameId,
          name: trimmedName,
          rollno: trimmedRollno,
          score: numericScore,
        }),
      });

      if (response.ok) {
        alert(`Score entry for ${gameName} added successfully`);
        setName('');
        setRollno('');
        setScore('');
      } else {
        const text = await response.text();
        alert(`Failed to add score entry: ${text}`);
        console.error('Response status:', response.status, 'Body:', text);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
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
        <h2>Submit Score for {gameName || 'Unknown Game'}</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', margin: '10px', width: '200px' }}
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={rollno}
          onChange={(e) => setRollno(e.target.value)}
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
        <button
          onClick={handleSubmit}
          style={{ padding: '10px 20px', marginTop: '20px' }}
        >
          Submit Score
        </button>
      </div>
    </div>
  );
}

export default ScoreEntry;

