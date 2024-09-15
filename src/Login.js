import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from './unibitLogo.jpg';

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
                throw new Error(data.message || 'Wrong username or password!');
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
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed', // Ensures the background doesn't move on scroll
            }}
        >
            <Container maxWidth="xs">
                {/* Заглавието "Login" с бял цвят */}
                <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
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
                        InputProps={{
                            style: {
                                color: 'white',
                                fontWeight: 'bold',
                                borderColor: 'white',
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                color: 'white',
                                fontWeight: 'bold'
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                        }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            style: {
                                color: 'white',
                                fontWeight: 'bold',
                                borderColor: 'white',
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                color: 'white',
                                fontWeight: 'bold'
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
                {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}

                {/* Home бутон с лилав фон и бели букви */}
                <Button
                    component={Link}
                    to="/"
                    variant="contained" // Променено от outlined на contained за попълване
                    fullWidth
                    sx={{
                        marginTop: '20px',
                        backgroundColor: '#6a0dad', // Лилав цвят за фона
                        color: 'white', // Бели букви
                        '&:hover': {
                            backgroundColor: '#4b0082', // По-тъмен лилав при hover
                        },
                    }}
                >
                    Home
                </Button>
            </Container>
        </Box>
    );
};

export default Login;
