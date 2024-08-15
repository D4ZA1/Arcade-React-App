import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Scores() {
    const [scores, setScores] = useState([]);
    const location = useLocation();
    const isGuest = location.state?.isGuest || false;

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch('http://192.168.24.149:3001/scores', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Sort the scores in descending order based on the totalScore
                    const sortedData = data.sort((a, b) => b.totalScore - a.totalScore);
                    setScores(sortedData);
                } else {
                    console.error('Error fetching scores');
                }
            } catch (error) {
                console.error('Error fetching scores', error);
            }
        };

        fetchScores();
    }, []);

    return (
        <div style={{
            textAlign: 'center',
            marginTop: '50px',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
        }}>
            <h2 style={{ fontSize: '2em', color: '#444', marginBottom: '20px' }}>
                Player Total Scores {scores.length > 0 && `(${scores.length} entries)`}
            </h2>

            {!isGuest && (
                <nav style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 20px',
                    backgroundColor: '#333',
                    color: '#fff',
                    marginBottom: '30px'
                }}>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Arcade Score App</div>
                    <div>
                        <a href="/games" style={navLinkStyle}>Games</a>
                        <a href="/scores" style={navLinkStyle}>Scores</a>
                        <a href="/login" style={navLinkStyle}>Logout</a>
                    </div>
                </nav>
            )}

            {scores.length === 0 ? (
                <p style={{ fontSize: '1.2em', color: '#777' }}>No scores available.</p>
            ) : (
                <div style={contentStyle}>
                    <img src="left-image-url.jpeg" alt="Left Image" style={imageStyle} />
                    <table style={tableStyle}>
                        <thead>
                        <tr>
                            <th style={thTdStyle}>Username</th>
                            <th style={thTdStyle}>Total Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scores.map((score, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                <td style={thTdStyle}>{score.username}</td>
                                <td style={thTdStyle}>{score.totalScore}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <img src="right-image-url.jpeg" alt="Right Image" style={imageStyle} />
                </div>
            )}

            {isGuest && <p style={{ marginTop: '20px', color: '#888' }}>You are in guest mode, access to other pages is restricted.</p>}
        </div>
    );
}

const navLinkStyle = {
    color: '#fff',
    textDecoration: 'none',
    margin: '0 15px',
    fontSize: '1.2em',
};

const contentStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
};

const tableStyle = {
    margin: '0 20px',
    borderCollapse: 'collapse',
    width: '60%',
    maxWidth: '600px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
};

const thTdStyle = {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontSize: '1.1em',
};

const imageStyle = {
    width: '150px',
    height: 'auto',
    objectFit: 'cover',
    alignItems: 'center',
};

export default Scores;
