import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyComments = () => {
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null); // За проследяване на редактирания коментар
    const [newCommentText, setNewCommentText] = useState(''); // За съхранение на новия текст
    const [showEmpty, setShowEmpty] = useState(false); // За проследяване на чекбокса
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:8080/svc/library/comment', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }

                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, []);

    // Функция за изтриване на коментар
    const handleDelete = async (rentId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:8080/svc/library/book-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rentId: rentId,
                    comment: null   // Изпращаме null за коментара
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            // След успешното изтриване, връщаме потребителя към началната страница
            navigate('/');
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Функция за обработка на редакция на коментар
    const handleEdit = (rentId, currentComment) => {
        setEditingCommentId(rentId); // Задаваме ID на коментара, който ще редактираме
        setNewCommentText(currentComment); // Поставяме текущия коментар в полето за редакция
    };

    // Функция за запазване на редактирания коментар
    const handleSave = async (rentId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:8080/svc/library/book-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rentId: rentId,
                    comment: newCommentText // Изпращаме новия коментар
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save comment');
            }

            // След успешното запазване, нулираме състоянието и обновяваме списъка с коментари
            setEditingCommentId(null);
            setNewCommentText('');
            // Може да презаредим коментарите или да навигираме към началната страница
            navigate('/');
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    };

    // Филтриране на коментарите в зависимост от състоянието на чекбокса
    const filteredComments = showEmpty
        ? comments // Показваме всички коментари, когато чекбоксът е маркиран
        : comments.filter(comment => comment.comment !== null); // Показваме само тези с непразни коментари

    return (
        <Container sx={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
                My Comments
            </Typography>

            {/* Добавяме бутон Home */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')} // Връща към началната страница
                sx={{ marginBottom: '2rem' }}
            >
                Home
            </Button>

            {/* Чекбокс за показване на коментари с null */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showEmpty}
                        onChange={(e) => setShowEmpty(e.target.checked)} // Обновяваме състоянието при промяна на чекбокса
                    />
                }
                label="Show empty comments"
            />

            <Grid container spacing={4}>
                {filteredComments.length > 0 ? (
                    filteredComments.map((comment, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {comment.bookTitle}
                                    </Typography>
                                    {editingCommentId === comment.rentId ? (
                                        <TextField
                                            fullWidth
                                            value={newCommentText}
                                            onChange={(e) => setNewCommentText(e.target.value)}
                                            label="Edit Comment"
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                        />
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            {comment.comment}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    {editingCommentId === comment.rentId ? (
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => handleSave(comment.rentId)}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEdit(comment.rentId, comment.comment)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    <Button
                                        size="small"
                                        color="secondary"
                                        onClick={() => handleDelete(comment.rentId)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" align="center">
                        No comments found.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
};

export default MyComments;
