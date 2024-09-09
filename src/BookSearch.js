import React, { useState } from 'react';
import Modal from 'react-modal';
import {
    Container,
    TextField,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Alert,
    Box,
    IconButton
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import backgroundImage from './unibitLogo.jpg';
import { authFetch, logout } from './authFetch';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const BookSearch = () => {
    const [criteria, setCriteria] = useState({
        title: '',
        author: '',
        isbn: '',
        priceFrom: '',
        priceTo: ''
    });
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedBook, setSelectedBook] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCriteria({ ...criteria, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const transformedCriteria = {
            title: criteria.title || null,
            author: criteria.author || null,
            isbn: criteria.isbn || null,
            priceFrom: criteria.priceFrom || null,
            priceTo: criteria.priceTo || null
        };

        try {
            const data = await authFetch('http://localhost:8080/svc/library/book/search', {
                method: 'POST',
                body: JSON.stringify(transformedCriteria),
            });
            setResults(data);
            setError('');
        } catch (error) {
            if (error.message === 'NoTokenError') {
                setError('Please log in first');
                navigate('/login');
            } else {
                setError(`Error: ${error.message}`);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedResults = () => {
        if (!sortConfig.key) return results;

        const sorted = [...results].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    };

    const openModal = (book) => {
        const role = localStorage.getItem('role');
        if (role === 'ADMIN') {
            setSelectedBook(book);
            setQuantity(0);
            setUserId(''); // Reset userId when opening modal
        }
    };

    const closeModal = () => {
        setSelectedBook(null);
        setQuantity(0);
        setUserId('');
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => Math.max(prevQuantity + amount, 0)); // Ensure quantity doesn't go below 0
    };

    const handleAddQuantity = async () => {
        if (selectedBook) {
            const newStock = selectedBook.stock + quantity;
            try {
                await authFetch(`http://localhost:8080/svc/library/book/${selectedBook.id}?stock=${newStock}`, {
                    method: 'PATCH',
                });
                setResults([]);
                closeModal();
            } catch (error) {
                setResults([]);
                closeModal();
            }
        }
    };

    const handleRentBook = async () => {
        if (selectedBook && userId) {
            const requestBody = {
                userId: parseInt(userId, 10),
                bookId: selectedBook.id,
                returnDate: dayjs().add(6, 'month').format('YYYY-MM-DD')
            };

            try {
                await authFetch('http://localhost:8080/svc/library/book-rent', {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                });
                closeModal();
            } catch (error) {
                console.error('Error renting book:', error);
                closeModal();
            }
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                padding: '2rem',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'transparent',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                    maxWidth: '800px',
                    width: '100%',
                    marginBottom: '2rem',
                }}
            >
                <Button onClick={handleHomeClick} variant="contained" color="secondary" sx={{ marginBottom: '1rem' }}>
                    Home
                </Button>
                <Typography variant="h4" gutterBottom>
                    Search Books
                </Typography>
                <Button onClick={handleLogout} variant="contained" color="secondary" sx={{ marginBottom: '1rem' }}>
                    Logout
                </Button>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Title"
                                name="title"
                                value={criteria.title}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                color="primary"
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                                InputLabelProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Author"
                                name="author"
                                value={criteria.author}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                color="primary"
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                                InputLabelProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="ISBN"
                                name="isbn"
                                value={criteria.isbn}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                color="primary"
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                                InputLabelProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Price From"
                                name="priceFrom"
                                value={criteria.priceFrom}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                variant="outlined"
                                color="primary"
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                                InputLabelProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Price To"
                                name="priceTo"
                                value={criteria.priceTo}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                variant="outlined"
                                color="primary"
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                                InputLabelProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}
            </Box>

            {results.length > 0 && (
                <TableContainer component={Paper} sx={{
                    marginTop: '2rem',
                    maxWidth: '800px',
                    width: '100%',
                    backgroundColor: 'transparent',
                    borderRadius: '8px'
                }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}
                                           onClick={() => requestSort('title')}>
                                    Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}
                                           onClick={() => requestSort('author')}>
                                    Author {sortConfig.key === 'author' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}
                                           onClick={() => requestSort('isbn')}>
                                    ISBN {sortConfig.key === 'isbn' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}
                                           onClick={() => requestSort('price')}>
                                    Price {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedResults().map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell sx={{ color: '#fff' }}>{book.title}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{book.author}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{book.isbn}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{book.price}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>
                                        <Button onClick={() => openModal(book)} variant="contained" color="primary">
                                            Adjust Stock
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {selectedBook && (
                <Modal
                    isOpen={!!selectedBook}
                    onRequestClose={closeModal}
                    contentLabel="Adjust Stock"
                    ariaHideApp={false}
                    style={{
                        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                        content: {
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#fff',
                            padding: '20px',
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Box sx={{ color: '#fff', fontWeight: 'bold' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
                            Adjust Stock for {selectedBook.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
                            Current Stock: {selectedBook.stock}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
                            Stock Available: {selectedBook.stockAvailable}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 0} sx={{ color: '#fff' }}>
                                <Remove />
                            </IconButton>
                            <TextField
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                inputProps={{ min: 0 }}
                                sx={{
                                    width: '80px',
                                    textAlign: 'center',
                                    color: '#fff',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#fff',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#fff', // Color for the input text
                                    },
                                }}
                            />
                            <IconButton onClick={() => handleQuantityChange(1)} sx={{ color: '#fff' }}>
                                <Add />
                            </IconButton>
                        </Box>
                        <Button onClick={handleAddQuantity} variant="contained" color="primary">
                            Add Quantity
                        </Button>
                        <TextField
                            label="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            type="number"
                            fullWidth
                            variant="outlined"
                            color="primary"
                            sx={{
                                marginTop: '1rem',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#b8b8b8', // Background color for the text field
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#b8b8b8', // Color of the label
                                },
                                '& .MuiInputBase-input': {
                                    color: '#b8b8b8', // Color of the input text
                                },
                            }}
                        />
                        <Button onClick={handleRentBook} variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
                            Rent Book
                        </Button>
                        <Button onClick={closeModal} variant="contained" color="secondary" sx={{ marginLeft: '1rem' }}>
                            Cancel
                        </Button>
                    </Box>
                </Modal>
            )}
        </Box>
    );
};

export default BookSearch;
