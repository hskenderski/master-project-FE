import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './unibitLogo.jpg'; // Импортиране на изображението за фон

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8080/svc/library/user', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user info');
                    }

                    const data = await response.json();
                    setUserInfo(data);
                    setFormData({
                        firstName: data.firstName,
                        secondName: data.secondName,
                        thirdName: data.thirdName,
                        mainAddress: data.mainAddress,
                        age: data.age
                    });
                } catch (error) {
                    console.error('Error fetching user info:', error);
                    navigate('/login');
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/login');
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditToggle = () => {
        setEditing(!editing);
        if (editing) {
            // Reset success message when editing is toggled off
            setSuccessMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:8080/svc/library/user', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user info');
                }

                // Fetch updated user info
                const updatedData = await fetch('http://localhost:8080/svc/library/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!updatedData.ok) {
                    throw new Error('Failed to fetch updated user info');
                }

                const updatedUserInfo = await updatedData.json();
                setUserInfo(updatedUserInfo);
                setEditing(false);
                setError(null);
                setSuccessMessage('User information updated successfully!');
            } catch (error) {
                setError('Failed to update user info');
                console.error('Error updating user info:', error);
            }
        } else {
            navigate('/login');
        }
    };

    const handleHomeRedirect = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}
        >
            <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', width: '100%', maxWidth: '1200px' }}>
                <Typography variant="h4" gutterBottom align="center">
                    User Information
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : userInfo ? (
                    <Box>
                        <Grid container spacing={2} mb={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">First Name:</Typography>
                                {editing ? (
                                    <TextField
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                ) : (
                                    <Typography variant="body1">{userInfo.firstName}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Second Name:</Typography>
                                {editing ? (
                                    <TextField
                                        name="secondName"
                                        value={formData.secondName}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                ) : (
                                    <Typography variant="body1">{userInfo.secondName}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Third Name:</Typography>
                                {editing ? (
                                    <TextField
                                        name="thirdName"
                                        value={formData.thirdName}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                ) : (
                                    <Typography variant="body1">{userInfo.thirdName}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Email:</Typography>
                                <Typography variant="body1">{userInfo.email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Main Address:</Typography>
                                {editing ? (
                                    <TextField
                                        name="mainAddress"
                                        value={formData.mainAddress}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                ) : (
                                    <Typography variant="body1">{userInfo.mainAddress}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Age:</Typography>
                                {editing ? (
                                    <TextField
                                        name="age"
                                        type="number"
                                        value={formData.age || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                ) : (
                                    <Typography variant="body1">{userInfo.age}</Typography>
                                )}
                            </Grid>
                        </Grid>
                        {error && <Alert severity="error" sx={{ marginBottom: '1rem' }}>{error}</Alert>}
                        {successMessage && <Alert severity="success" sx={{ marginBottom: '1rem' }}>{successMessage}</Alert>}
                        <Box textAlign="center">
                            {editing ? (
                                <Box>
                                    <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginRight: '1rem' }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        onClick={handleEditToggle}
                                        variant="outlined"
                                        color="secondary"
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            ) : (
                                <Button
                                    onClick={handleEditToggle}
                                    variant="contained"
                                    color="secondary"
                                >
                                    Edit
                                </Button>
                            )}
                        </Box>
                        <Box textAlign="center" mt={2}>
                            <Button
                                onClick={handleHomeRedirect}
                                variant="contained"
                                color="primary"
                            >
                                Home
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body1" align="center">No user information available.</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default UserInfo;
