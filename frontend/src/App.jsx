import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css'; 
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
const socket = io('http://localhost:5000');

function App() {
    const [connectedUsers, setConnectedUsers] = useState({});
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState(null);
    const [recipientId, setRecipientId] = useState('');

    useEffect(() => {
        socket.on('usersConnected', (users) => {
            setConnectedUsers(users);
        });

        socket.on('mySocketId', (id) => {
            setSenderId(id);
        });

        socket.on('receiveMessage', ({ from, message }) => {
            setMessages((prevMessages) => [...prevMessages, { from, message, entering: true }]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    useEffect(() => {
        console.log('sender is', connectedUsers[senderId]);
        console.log('receiver is', connectedUsers[recipientId]);
    }, [senderId, recipientId]);

    const registerUser = () => {
        if (username) {
            socket.emit('registerUser', username);
        }
    };

    const sendMessage = () => {
        if (message && recipientId) {
            socket.emit('sendMessage', { recipientId, message });
            const msgObject = { from: username, message };
            setMessages((prevMessages) => [...prevMessages, msgObject , msg]);
            setMessage('');
        }
    };

    const connectWith = (id) => {
        setRecipientId(id);
    };

    return (

        <Routes>

            <Route path='/Login' element={<Login/>}/>
            <Route path='/Register' element={<Register/>}/>
            <Route element={<ProtectedRoute/>}>
                <Route path='/' element={<Home/>}/>
            </Route>

        </Routes>

       
    );
}

export default App;
