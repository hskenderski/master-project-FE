import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
    const [book, setBook] = useState({
        title: '',
        author: '',
        isbn: '',
        price: '',
        stock: '',
        stockAvailable: '',
        publishDate: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transformedBook = {
            ...book,
            price: parseFloat(book.price),
            stock: parseInt(book.stock),
            stockAvailable: parseInt(book.stockAvailable),
            publishDate: book.publishDate
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/svc/library/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transformedBook),
            });

            if (!response.ok) {
                throw new Error('Failed to add book');
            }

            setError('');
            navigate('/'); // Пренасочване към началната страница след успешно добавяне на книга
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const handleHomeRedirect = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm" sx={{ paddingTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                Add a New Book
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    name="title"
                    value={book.title}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Author"
                    name="author"
                    value={book.author}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="ISBN"
                    name="isbn"
                    value={book.isbn}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={book.price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={book.stock}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Stock Available"
                    name="stockAvailable"
                    type="number"
                    value={book.stockAvailable}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Publish Date"
                    name="publishDate"
                    type="date"
                    value={book.publishDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '20px' }}>
                    Add Book
                </Button>
            </form>
            {error && <Typography variant="body2" color="error" align="center" sx={{ marginTop: '20px' }}>{error}</Typography>}
            <Button
                onClick={handleHomeRedirect}
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginTop: '20px' }}
            >
                Home
            </Button>
        </Container>
    );
};

export default AddBook;
