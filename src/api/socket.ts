import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

const userSockets = new Map<string, string>();
const initializeSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer);
    setupSocketHandlers(io);

    io.on('connection', (socket: Socket) => {
        console.log('A user connected: ' + socket.id);

        socket.on('register', (userId: string) => {
            userSockets.set(userId, socket.id);
        });

        // You might expose this function to allow external triggering of events
        const notifyUser = (likedUserId: string, fromUserId: string) => {
            const targetSocketId = userSockets.get(likedUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('likeNotification', { fromUserId });
            }
        };

        // Expose the notifyUser function or integrate with external systems as needed
    });

    return io; // Return the io instance in case you need to interact with it outside this module
};

const setupSocketHandlers = (io: Server) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('register', (userId: string) => {
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

export {setupSocketHandlers, initializeSocket, userSockets};
