const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public')); // serve static files from the public folder

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('message', (msg) => {
    console.log('received message:', msg);
    io.emit('message', msg); // broadcast message to all connected clients
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

///////
