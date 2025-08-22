const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const { Server } = require('socket.io');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
  
  server.listen(3000, () => {
    console.log('listening on *:3000');
  });

  // socket.io initiation
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('update-text', 'Hello, world!');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
  
  