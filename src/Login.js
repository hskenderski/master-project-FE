import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = credentials;
        const encodedCredentials = btoa(`${username}:${password}`); // Encode username and password in Base64

        try {
            const response = await fetch('http://localhost:8080/svc/library/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${encodedCredentials}`
                },
                body: JSON.stringify(credentials), // Adjust if needed
            });

            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.indexOf('application/json') !== -1) {
                data = await response.json();
            } else {
                data = await response.text(); // handle the case where response is not JSON
            }

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Assuming data is the token if not JSON
            const token = typeof data === 'string' ? data : data.token;
            localStorage.setItem('token', token);
            setError('');
            navigate('/'); // Redirect to the home page after successful login
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Container maxWidth="xs">
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
                {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}
                <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    Home
                </Button>
            </Container>
        </Box>
    );
};

export default Login;
