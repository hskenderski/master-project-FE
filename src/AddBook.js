import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './unibitLogo.jpg';

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
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Настройване на фона на тялото
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
        setBook({ ...book, [name]: value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
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

            const bookIdText = await response.text();
            const bookId = parseInt(bookIdText);

            if (imageFile && bookId) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('bookId', bookId);

                const fileResponse = await fetch('http://localhost:8080/svc/library/file', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData
                });

                if (!fileResponse.ok) {
                    throw new Error('Failed to upload image');
                }
            } else {
                throw new Error('Book ID or image is missing.');
            }

            setError('');
            navigate('/');
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const handleHomeRedirect = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm" sx={{
            paddingTop: '2rem',
            minHeight: '100vh',
            color: '#fff'
        }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>
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
                    sx={{
                        '& .MuiInputLabel-root': { color: '#fff', fontWeight: 'bold' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#aaa' },
                            '& input': { color: '#fff' }
                        }
                    }}
                />
                <TextField
                    label="Author"
                    name="author"
                    value={book.author}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                        '& .MuiInputLabel-root': { color: '#fff', fontWeight: 'bold' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#aaa' },
                            '& input': { color: '#fff' }
                        }
                    }}
                />
                <TextField
                    label="ISBN"
                    name="isbn"
                    value={book.isbn}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                        '& .MuiInputLabel-root': { color: '#fff', fontWeight: 'bold' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#aaa' },
                            '& input': { color: '#fff' }
                        }
                    }}
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
                    sx={{
                        '& .MuiInputLabel-root': { color: '#fff', fontWeight: 'bold' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#aaa' },
                            '& input': { color: '#fff' }
                        }
                    }}
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
                    sx={{
                        '& .MuiInputLabel-root': { color: '#fff', fontWeight: 'bold' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#aaa' },
                            '& input': { color: '#fff' }
                        }
                    }}
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
                    sx={{
                        '& .MuiInputLabel-root': { color: '#fff', fontWeight: 'bold' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#aaa' },
                            '& input': { color: '#fff' }
                        }
                    }}
                />
                <TextField
                    label="Publish Date"
                    name="publishDate"
                    type="date"
                    value={book.publishDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                    sx={{
                        '& .MuiInputLabel-root': { color: '#fff', fontWeight: 'bold' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#aaa' },
                            '& input': { color: '#fff' }
                        }
                    }}
                />

                <input
                    type="file"
                    accept=".jpeg, .jpg"
                    onChange={handleFileChange}
                    style={{ marginTop: '20px', color: '#fff' }}
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
