
import './Scores.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BACK_URL from '../config';

function Scores() {
  const [scores, setScores] = useState([]);
  const [searchRollno, setSearchRollno] = useState('');
  const [filteredScores, setFilteredScores] = useState([]);
  const location = useLocation();
  const isGuest = location.state?.isGuest || false;

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await fetch(`${BACK_URL}/scores`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          // Sort descending by totalScore just in case
          const sortedData = data.sort((a, b) => b.totalScore - a.totalScore);
          setScores(sortedData);
          setFilteredScores(sortedData);
        } else {
          console.error('Error fetching scores');
        }
      } catch (error) {
        console.error('Error fetching scores', error);
      }
    }
    fetchScores();
  }, []);

  useEffect(() => {
    if (searchRollno.trim() === '') {
      setFilteredScores(scores);
    } else {
      const filtered = scores.filter(score =>
        score.rollno.toLowerCase().includes(searchRollno.toLowerCase())
      );
      setFilteredScores(filtered);
    }
  }, [searchRollno, scores]);

  return (
    <div className="scores-container">
      {!isGuest && (
        <nav className="navbar">
          <div className="navbar-brand">Arcade Score App</div>
          <div className="navbar-links">
            <a href="/games">Games</a>
            <a href="/scores">Scores</a>
            <a href="/login">Logout</a>
          </div>
        </nav>
      )}

      <h2>
        Player Total Scores {filteredScores.length > 0 && `(${filteredScores.length} entries)`}
      </h2>

      <input
        type="text"
        placeholder="Search by Roll Number"
        value={searchRollno}
        onChange={(e) => setSearchRollno(e.target.value)}
        className="search-input"
      />

      {filteredScores.length === 0 ? (
        <p className="no-scores-message">No scores available.</p>
      ) : (
        <div className="content">
          <img src="/left-image-url.jpeg" alt="Left" className="side-image" />
          <div className="table-card">
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.map((score, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>{score.name}</td>
                    <td>{score.rollno}</td>
                    <td>{score.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <img src="/right-image-url.jpeg" alt="Right" className="side-image" />
        </div>
      )}

      {isGuest && (
        <p className="guest-message">
          You are in guest mode, access to other pages is restricted.
        </p>
      )}
    </div>
  );
}

export default Scores;

