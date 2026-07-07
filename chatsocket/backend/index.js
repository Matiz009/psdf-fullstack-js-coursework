const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const CLIENT_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({ origin: CLIENT_ORIGINS }));

const server = http.createServer(app); // Wrap Express in HTTP server

const io = new Server(server, {        // Attach Socket.io to HTTP server
  cors: { origin: CLIENT_ORIGINS, methods: ['GET', 'POST'] }
});

// room -> Map<socketId, username>
const rooms = new Map();

function getRoomUsers(room) {
  const users = rooms.get(room);
  return users ? Array.from(users.values()) : [];
}

function leaveCurrentRoom(socket) {
  const { room, username } = socket.data;
  if (!room) return;

  socket.leave(room);
  const users = rooms.get(room);
  if (users) {
    users.delete(socket.id);
    if (users.size === 0) {
      rooms.delete(room);
    } else {
      io.to(room).emit('system', `${username} left the room`);
      io.to(room).emit('roomUsers', getRoomUsers(room));
    }
  }
  socket.data.room = null;
  socket.data.username = null;
}

io.on('connection', (socket) => {      // Fires when a client connects
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ room, username }) => {
    if (!room || !username) return;

    leaveCurrentRoom(socket);          // leave any previous room first

    socket.join(room);
    socket.data.room = room;
    socket.data.username = username;

    if (!rooms.has(room)) rooms.set(room, new Map());
    rooms.get(room).set(socket.id, username);

    io.to(room).emit('system', `${username} joined the room`);
    io.to(room).emit('roomUsers', getRoomUsers(room));
  });

  socket.on('sendMessage', ({ room, message, username }) => {
    if (!room || !message) return;
    io.to(room).emit('receiveMessage', {
      id: `${socket.id}-${Date.now()}`,
      message,
      username,
      time: new Date(),
    });
  });

  socket.on('typing', ({ room, username, isTyping }) => {
    if (!room) return;
    socket.to(room).emit('typing', { username, isTyping });
  });

  socket.on('leaveRoom', () => {
    leaveCurrentRoom(socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    leaveCurrentRoom(socket);
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
