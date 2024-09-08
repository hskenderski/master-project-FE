import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authFetch } from './authFetch';
import book1 from './vlastelinyt-na-prystenite-pylno-izdanie.jpg';

const MyBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const [selectedRentId, setSelectedRentId] = useState(null);
    const [isCommenting, setIsCommenting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await authFetch('http://localhost:8080/svc/library/book', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBooks(data);
            } catch (error) {
                setError(`Error: ${error.message}`);
            }
        };

        fetchBooks();
    }, []);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleAddCommentClick = async (rentId) => {
        setSelectedRentId(rentId);
        setIsCommenting(true);
        try {
            // Извличане на коментара за избраната книга
            const bookData = books.find(book => book.rentId === rentId);
            if (bookData && bookData.comment) {
                setComment(bookData.comment);
            } else {
                setComment(''); // Ако няма коментар, уверете се, че полето е празно
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const handleCommentSubmit = async () => {
        if (!comment || !selectedRentId) return;

        try {
            const response = await authFetch('http://localhost:8080/svc/library/book-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    rentId: selectedRentId,
                    comment: comment,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            alert('Comment submitted successfully!');
            setComment('');
            setSelectedRentId(null);
            setIsCommenting(false);
        } catch (error) {
            handleHomeClick()
        }
    };

    const handleCancelComment = () => {
        setComment('');
        setSelectedRentId(null);
        setIsCommenting(false);
    };

    return (
        <Container sx={{ marginTop: '2rem' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleHomeClick}
                sx={{ marginBottom: '2rem' }}
            >
                Home
            </Button>
            <Typography variant="h4" gutterBottom align="center" color="primary">
                My Books
            </Typography>
            {error && <Typography color="error" align="center">{error}</Typography>}
            <Grid container spacing={4}>
                {books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.rentId}> {/* Use rentId here as key */}
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={book1} // Placeholder image
                                alt={book.title}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Author: {book.author}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ISBN: {book.isbn}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Price: ${book.price}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Date Published: {new Date(book.datePublished).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Rent Date: {book.rentDate ? new Date(book.rentDate).toLocaleDateString() : 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Return Date: {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Returned: {book.returned ? 'Yes' : 'No'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Stock: {book.stock} | Available: {book.stockAvailable}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAddCommentClick(book.rentId)} // Use rentId here
                                    sx={{ marginTop: '1rem' }}
                                >
                                    Add Comment
                                </Button>
                                {isCommenting && selectedRentId === book.rentId && (
                                    <div>
                                        <TextField
                                            label="Your Comment"
                                            multiline
                                            rows={4}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginTop: '1rem' }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleCommentSubmit}
                                            sx={{ marginTop: '1rem' }}
                                        >
                                            Submit Comment
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleCancelComment}
                                            sx={{ marginTop: '1rem', marginLeft: '1rem' }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default MyBooksPage;
