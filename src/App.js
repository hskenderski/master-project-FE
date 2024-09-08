import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import BookSearch from './BookSearch';
import Login from './Login';
import Registration from './Registration'; // Импортиране на Registration компонента
import UserInfo from './UserInfo';
import AddBook from "./AddBook"; // Импортиране на UserInfo компонента
import UserSearch from './UserSearch';
import MyBooksPage from './MyBookPage';
import MyComments from './MyComments'; // Импортиране на MyComments компонента

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book-search" element={<BookSearch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} /> {/* Добавяне на рут за регистрация */}
                <Route path="/user-info" element={<UserInfo />} /> {/* Добавяне на рут за информация за потребителя */}
                <Route path="/add-book" element={<AddBook />} /> {/* Добавяме новия маршрут */}
                <Route path="/user-search" element={<UserSearch />} />
                <Route path="/my-books" element={<MyBooksPage />} />
                <Route path="/my-comments" element={<MyComments />} /> {/* Добавяме новия маршрут */}
            </Routes>
        </Router>
    );
};

export default App;
