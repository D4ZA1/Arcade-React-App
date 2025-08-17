
// frontend/src/components/GameSelection.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSelection.css';
import BACK_URL from '../config';

function GameSelection() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(`${BACK_URL}/games`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setGames(data);
        } else {
          console.error('Failed to fetch games');
        }
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    }
    fetchGames();
  }, []);

  const handleGameSelect = (game) => {
    // Pass custom game_id and gameName
    navigate('/score-entry', { state: { gameId: game.game_id, gameName: game.name } });
  };

  return (
    <div className="game-selection-container">
      <nav className="navbar">
        <div className="navbar-brand">Arcade Score App</div>
        <div className="navbar-links">
          <a href="/games">Games</a>
          <a href="/scores">Scores</a>
          <a href="/login">Logout</a>
        </div>
      </nav>

      <div className="content">
        <h2>Select a Game</h2>
        <div className="game-cards">
          {games.map((game) => (
            <div
              key={game.game_id}
              className="game-card"
              onClick={() => handleGameSelect(game)}
            >
              <div className="game-card-content">
                <h3>{game.name}</h3>
                <p>Click to enter scores for {game.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameSelection;

