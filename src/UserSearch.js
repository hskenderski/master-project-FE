import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box
} from '@mui/material';
import { authFetch } from './authFetch';

const UserSearch = () => {
    const navigate = useNavigate();
    const [criteria, setCriteria] = useState({
        firstName: '',
        secondName: '',
        thirdName: '',
        email: '',
        mainAddress: ''
    });
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openBookModal, setOpenBookModal] = useState(false);
    const [openCommentsModal, setOpenCommentsModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [comments, setComments] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCriteria({ ...criteria, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transformedCriteria = Object.fromEntries(
            Object.entries(criteria).map(([key, value]) => [key, value || null])
        );

        try {
            const data = await authFetch('http://localhost:8080/svc/library/user/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transformedCriteria),
            });
            setResults(data);
            setError('');
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const handleRowClick = async (userId) => {
        setSelectedUserId(userId);
        try {
            const data = await authFetch(`http://localhost:8080/svc/library/book?userId=${userId}`, {
                method: 'GET'
            });
            setSelectedBooks(data);
            setOpenModal(true);
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const handleViewComments = async (userId) => {
        try {
            const data = await authFetch(`http://localhost:8080/svc/library/comment?userId=${userId}`, {
                method: 'GET'
            });
            setComments(data);
            setOpenCommentsModal(true);
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    const handleBookRowClick = (book) => {
        setSelectedBook(book);
        setOpenBookModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedBooks([]);
        setSelectedBook(null);
    };

    const handleCloseBookModal = () => {
        setOpenBookModal(false);
        setSelectedBook(null);
    };

    const handleCloseCommentsModal = () => {
        setOpenCommentsModal(false);
        setComments([]);
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleReturnBook = async () => {
        if (!selectedBook || !selectedBook.rentId) {
            setError("Rent ID is not available");
            return;
        }

        try {
            const response = await authFetch(`http://localhost:8080/svc/library/book-return?rentId=${selectedBook.rentId}`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                throw new Error('Failed to return the book');
            }

            setError('');
            setOpenBookModal(false);
            alert("Book returned successfully!");

            handleHomeClick();
        } catch (error) {
            handleHomeClick();
        }
    };

    return (
        <Container>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleHomeClick}
                style={{ marginBottom: '20px' }}
            >
                Home
            </Button>
            <Typography variant="h4" gutterBottom>
                Search Users
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={criteria.firstName}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Second Name"
                            name="secondName"
                            value={criteria.secondName}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Third Name"
                            name="thirdName"
                            value={criteria.thirdName}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            name="email"
                            value={criteria.email}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Main Address"
                            name="mainAddress"
                            value={criteria.mainAddress}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            color="primary"
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
            {results.length > 0 && (
                <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Second Name</TableCell>
                                <TableCell>Third Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Main Address</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.secondName}</TableCell>
                                    <TableCell>{user.thirdName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.mainAddress}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleRowClick(user.userId)}
                                        >
                                            View Books
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleViewComments(user.userId)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            View Comments
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Book Details</DialogTitle>
                <DialogContent>
                    {selectedBooks.length > 0 ? (
                        selectedBooks.map((book) => (
                            <Box key={book.id} onClick={() => handleBookRowClick(book)} style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                                <Typography variant="h6">{book.title}</Typography>
                                <Typography>Author: {book.author}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography>No book details available.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openBookModal}
                onClose={handleCloseBookModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Book Information</DialogTitle>
                <DialogContent>
                    {selectedBook ? (
                        <Box>
                            <Typography variant="h6">Title: {selectedBook.title}</Typography>
                            <Typography>Author: {selectedBook.author}</Typography>
                            <Typography>ISBN: {selectedBook.isbn}</Typography>
                            <Typography>Price: {selectedBook.price}</Typography>
                            <Typography>Rent Date: {selectedBook.rentDate}</Typography>
                            <Typography>Return Date: {selectedBook.returnDate}</Typography>
                            <Typography>Returned: {selectedBook.returned ? 'Yes' : 'No'}</Typography>
                        </Box>
                    ) : (
                        <Typography>No book details available.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBookModal} color="primary">
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleReturnBook}
                    >
                        Return Book
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openCommentsModal}
                onClose={handleCloseCommentsModal}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>User Comments</DialogTitle>
                <DialogContent>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <Box key={index} style={{ marginBottom: '1rem' }}>
                                <Typography variant="h6">Book Title: {comment.bookTitle}</Typography>
                                <Typography>Comment: {comment.comment}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography>No comments available.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCommentsModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserSearch;
