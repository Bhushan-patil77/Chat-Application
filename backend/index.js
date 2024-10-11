// server/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose')


DB_URL='mongodb+srv://bhushanravindrapatil77:iGA2Yuhg5626aHr7@cluster0.ap69s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

let users = {}; 

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('registerUser', (username) => {
        users[socket.id] = username; 
        console.log(`${username} connected`, socket.id);
        io.emit('usersConnected', users)

        socket.emit('mySocketId', socket.id)
    });

    socket.on('sendMessage', ({ recipientId, message }) => {
        socket.to(recipientId).emit('receiveMessage', {
            from: users[socket.id],
            message,
        });
    });

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} disconnected`);
        delete users[socket.id]; 
    });
});

mongoose.connect(DB_URL).then(()=>{
    console.log('db connected')

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})

const PORT = process.env.PORT || 5000;

 