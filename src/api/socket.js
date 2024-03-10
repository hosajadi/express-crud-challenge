"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSockets = exports.initializeSocket = exports.setupSocketHandlers = void 0;
const socket_io_1 = require("socket.io");
const userSockets = new Map();
exports.userSockets = userSockets;
const initializeSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer);
    setupSocketHandlers(io);
    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id);
        socket.on('register', (userId) => {
            userSockets.set(userId, socket.id);
        });
        // You might expose this function to allow external triggering of events
        const notifyUser = (likedUserId, fromUserId) => {
            const targetSocketId = userSockets.get(likedUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('likeNotification', { fromUserId });
            }
        };
        // Expose the notifyUser function or integrate with external systems as needed
    });
    return io; // Return the io instance in case you need to interact with it outside this module
};
exports.initializeSocket = initializeSocket;
const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('register', (userId) => {
            userSockets.set(userId, socket.id);
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            for (const [key, value] of userSockets.entries()) {
                if (value === socket.id) {
                    userSockets.delete(key);
                    return true;
                }
            }
        });
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
