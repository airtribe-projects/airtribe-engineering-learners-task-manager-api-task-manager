const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;
const userSockets = new Map(); // Maps userId -> Set of socketIds

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true
    }
  });

  // JWT Middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`User connected to socket: ${userId} (Socket ID: ${socket.id})`);

    // Track user sockets
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Join a private room dedicated to this user
    socket.join(`user:${userId}`);

    // Join a room for a team
    socket.on('joinTeam', (teamId) => {
      socket.join(`team:${teamId}`);
      console.log(`Socket ${socket.id} joined room team:${teamId}`);
    });

    // Leave a room for a team
    socket.on('leaveTeam', (teamId) => {
      socket.leave(`team:${teamId}`);
      console.log(`Socket ${socket.id} left room team:${teamId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId} (Socket ID: ${socket.id})`);
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

const notifyUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

const notifyTeam = (teamId, event, data) => {
  if (io) {
    io.to(`team:${teamId}`).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  notifyUser,
  notifyTeam
};
