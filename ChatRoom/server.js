const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let users = [];

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle connection event
io.on('connection', (socket) => {
  console.log('New user connected');

  // Handle joinChat event
  socket.on('joinChat', (username) => {
    users.push(username);
    io.emit('activeUsers', users);  // Send active users list to all clients
    console.log(`${username} joined the chat`);
  });

  // Handle chatMessage event
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);  // Broadcast message to all clients
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    users = users.filter(user => user !== socket.username);
    io.emit('activeUsers', users);  // Update active users list on disconnection
    console.log('User disconnected');
  });
});

// Start server on port 3000
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
