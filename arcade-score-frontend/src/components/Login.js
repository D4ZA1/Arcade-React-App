import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BACK_URL from '../config';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log(username,password);
            const response = await fetch(`${BACK_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            let data;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            console.log(data);

            if (response.ok) {
                alert(typeof data === 'string' ? data : data.message); // Handle both string and JSON messages
                navigate('/games'); // Redirect to the /games page
            } else {
                alert('Login failed: ' + (typeof data === 'string' ? data : data.message));
            }
        } catch (error) {
            console.error('Login failed', error);
            alert('Invalid credentials');
        }
    };

    const handleGuestLogin = () => {
        navigate('/scores', { state: { isGuest: true } }); // Navigate to scores page in guest mode
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: '10px', margin: '10px', width: '200px' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px', margin: '10px', width: '200px' }}
            />
            <br />
            <button onClick={handleLogin} style={{ padding: '10px 20px', marginTop: '20px' }}>Login</button>
            <br />
            <button onClick={handleGuestLogin} style={{ padding: '10px 20px', marginTop: '20px' }}>Guest Mode</button>
        </div>
    );
}

export default Login;
