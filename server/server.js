const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

var {generateMessage} = require('./utils/message');

var app = express();

var publicPath = path.join(__dirname,'../public');

var port = process.env.PORT || 3000;

var server = http.createServer(app);

var io = socketIO.listen(server);

io.on('connection', (socket) => {
    console.log('New user connected.');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App.'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

    socket.on('createMessage', (message, callback) => {
        console.log('newMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('disconnect', () => {
        console.log('user disconnected.');
    });
});

app.use(express.static(publicPath));


server.listen(port, () => {
    console.log(`listening at port: ${port}`);
})