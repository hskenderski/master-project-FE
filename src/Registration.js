import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Alert, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './unibitLogo.jpg';

const Registration = () => {
    const [user, setUser] = useState({
        firstName: '',
        secondName: '',
        thirdName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        mainAddress: '',
        age: '',
        roleName: 'USER' // по подразбиране задаваме ролята като USER
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Настройваме фоновото изображение за тялото на документа
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed'; // За да не се движи фона при скролиране

        // Почистване на стила при размонтиране на компонента
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundAttachment = '';
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleRoleChange = (e) => {
        setUser({ ...user, roleName: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transformedUser = {
            firstName: user.firstName || null,
            secondName: user.secondName || null,
            thirdName: user.thirdName || null,
            email: user.email || null,
            password: user.password || null,
            passwordConfirmation: user.passwordConfirmation || null,
            mainAddress: user.mainAddress || null,
            age: user.age ? parseInt(user.age) : null,
            roleName: user.roleName || 'USER'
        };

        if (!user.email || !user.password || !user.passwordConfirmation || !user.mainAddress) {
            setError('Email, Password, Password Confirmation, and Main Address fields are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/svc/library/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedUser),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Something went wrong');
            }

            setError('');
            navigate('/login'); // Пренасочване към страницата за логин след успешно регистриране
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const handleHomeRedirect = () => {
        navigate('/');
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
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            style: { color: 'white', fontWeight: 'bold' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontWeight: 'bold' },
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
                        label="Second Name"
                        name="secondName"
                        value={user.secondName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            style: { color: 'white', fontWeight: 'bold' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontWeight: 'bold' },
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
                        label="Third Name"
                        name="thirdName"
                        value={user.thirdName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            style: { color: 'white', fontWeight: 'bold' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontWeight: 'bold' },
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
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            style: { color: 'white', fontWeight: 'bold' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontWeight: 'bold' },
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
                        value={user.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            style: { color: 'white', fontWeight: 'bold' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontWeight: 'bold' },
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
                        label="Confirm Password"
                        name="passwordConfirmation"
                        type="password"
                        value={user.passwordConfirmation}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            style: { color: 'white', fontWeight: 'bold' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontWeight: 'bold' },
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
                        label="Main Address"
                        name="mainAddress"
                        value={user.mainAddress}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            style: { color: 'white', fontWeight: 'bold' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontWeight: 'bold' },
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
                        label="Age"
                        name="age"
                        type="number"
                        value={user.age}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            style: { color: 'white', fontWeight: 'bold' },
                        }}
                        InputLabelProps={{
                            style: { color: 'white', fontWeight: 'bold' },
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel style={{ color: 'white', fontWeight: 'bold' }}>Role</InputLabel>
                        <Select
                            value={user.roleName}
                            onChange={handleRoleChange}
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                            }}
                        >
                            <MenuItem value="USER">User</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Register
                    </Button>
                </form>
                {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}
                <Button
                    onClick={handleHomeRedirect}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                >
                    Home
                </Button>
            </Container>
        </Box>
    );
};

export default Registration;
