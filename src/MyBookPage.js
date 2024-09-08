import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, TextField, Modal, Box, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authFetch } from './authFetch';
import loadImage from './imageImports'; // Импортиране на функцията за зареждане на изображения
import backgroundImage from './unibitLogo.jpg'; // Импортиране на изображението за фон

const MyBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const [selectedRentId, setSelectedRentId] = useState(null);
    const [isCommenting, setIsCommenting] = useState(false);
    const [imageMap, setImageMap] = useState(new Map()); // Съхранение на заредените изображения
    const [openModal, setOpenModal] = useState(false);
    const [showReturned, setShowReturned] = useState(false); // Добавено състояние за showReturned
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

                // Зареждане на изображенията за всички книги
                const map = new Map();
                for (const book of data) {
                    const image = await loadImage(book.id);
                    map.set(book.id, image);
                }
                setImageMap(map);
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
        setOpenModal(true); // Open modal on comment button click
        try {
            const bookData = books.find(book => book.rentId === rentId);
            if (bookData && bookData.comment) {
                setComment(bookData.comment);
            } else {
                setComment('');
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
            setOpenModal(false); // Close modal on successful comment submit
        } catch (error) {
            handleHomeClick();
        }
    };

    const handleCancelComment = () => {
        setComment('');
        setSelectedRentId(null);
        setIsCommenting(false);
        setOpenModal(false); // Close modal on cancel
    };

    // Филтриране на книгите на база стойността на showReturned
    const filteredBooks = books.filter(book => showReturned || !book.returned);

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'bottom',
            minHeight: '100vh',
            padding: '2rem'
        }}>
            <Container sx={{ backgroundColor: 'transparent', padding: '2rem', borderRadius: '8px' }}>
                {/* Grid container to align Home button and checkbox next to each other */}
                <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '2rem',backgroundColor:"grey" }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleHomeClick}
                        >
                            Home
                        </Button>
                    </Grid>
                    <Grid item>
                        {/* Checkbox showReturned */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showReturned}
                                    onChange={(e) => setShowReturned(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Show Returned"
                        />
                    </Grid>
                </Grid>

                <Typography variant="h4" gutterBottom align="center" color="primary">
                    My Books
                </Typography>
                {error && <Typography color="error" align="center">{error}</Typography>}

                <Grid container spacing={4}>
                    {filteredBooks.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book.rentId}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="auto"
                                    image={imageMap.get(book.id) || '/path/to/placeholder/image'} // Извличане на изображение от Map
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
                                        onClick={() => handleAddCommentClick(book.rentId)}
                                        sx={{ marginTop: '1rem' }}
                                    >
                                        Add Comment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Modal for adding comments */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)' // Transparent background for modal
                }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Add Comment
                    </Typography>
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
                </Box>
            </Modal>
        </div>
    );
};

export default MyBooksPage;
