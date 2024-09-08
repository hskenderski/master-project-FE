import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from './unibitLogo.jpg';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');

        if (token) {
            setIsLoggedIn(true);
            if (storedRole) {
                setRole(storedRole);
            } else {
                fetchUserRole(token);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserRole = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/svc/library/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }

            const data = await response.json();
            setRole(data.role);
            localStorage.setItem('role', data.role);
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setRole('');
        navigate('/');
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                color: '#848383',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: '2rem',
                textAlign: 'center'
            }}
        >
            <Container align="center">
                <Typography variant="h2" gutterBottom>
                    Welcome to the Library
                </Typography>
                <Typography variant="h5" paragraph>
                    Explore our collection of books and more.
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {isLoggedIn && (
                        <Grid item>
                            <Button
                                component={Link}
                                to="/book-search"
                                variant="contained"
                                color="primary"
                                size="large"
                            >
                                Search Books
                            </Button>
                        </Grid>
                    )}
                    {role === 'ADMIN' && (
                        <Grid item>
                            <Button
                                component={Link}
                                to="/user-search"
                                variant="contained"
                                color="secondary"
                                size="large"
                            >
                                Search Users
                            </Button>
                        </Grid>
                    )}
                    {role === 'ADMIN' && (
                        <Grid item>
                            <Button
                                component={Link}
                                to="/add-book"
                                variant="contained"
                                color="secondary"
                                size="large"
                            >
                                Add Book
                            </Button>
                        </Grid>
                    )}
                    {role === 'USER' && (
                        <Grid item>
                            <Button
                                component={Link}
                                to="/my-comments"
                                variant="contained"
                                color="secondary"
                                size="large"
                            >
                                My Comments
                            </Button>
                        </Grid>
                    )}

                    {!isLoggedIn && (
                        <>
                            <Grid item>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                >
                                    Login
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                >
                                    Register
                                </Button>
                            </Grid>
                        </>
                    )}
                    {isLoggedIn && (
                        <>
                            <Grid item>
                                <Button
                                    component={Link}
                                    to="/user-info"
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                >
                                    User Info
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    component={Link}
                                    to="/my-books"
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                >
                                    My Books
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleLogout}
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                >
                                    Logout
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
