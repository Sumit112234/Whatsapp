import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; 

io.on("connection", (socket) => {
    
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));


	socket.on("typing", ({ senderId, receiverId }) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
		  io.to(receiverSocketId).emit("typing", senderId);
		}
	  });
	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

// const users = {}; // Store users and their socket IDs

// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on('register', (userId) => {
//         users[userId] = socket.id;
//         console.log(`User registered: ${userId}`);
//     });

//     socket.on('typing', ({ senderId, receiverId }) => {
//         const receiverSocketId = users[receiverId];
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit('typing', senderId);
//         }
//     });

//     socket.on('sendMessage', ({ senderId, receiverId, message }) => {
//         const receiverSocketId = users[receiverId];
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit('newMessage', { senderId, message });
//         }
//     });

//     socket.on('disconnect', () => {
//         for (const userId in users) {
//             if (users[userId] === socket.id) {
//                 delete users[userId];
//                 console.log(`User disconnected: ${userId}`);
//                 break;
//             }
//         }
//     });
// });




  

export { app, io, server };