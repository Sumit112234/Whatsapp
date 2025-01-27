import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";

import connectDb from "./database/connectDb.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "https://whatsapp-pre.vercel.app",
		methods: ["GET", "POST"],
	},
});

const PORT = process.env.PORT || 5000;
const userSocketMap = {};

// Socket.IO logic
export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId !== "undefined") userSocketMap[userId] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("typing", ({ senderId, receiverId }) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("typing", senderId);
		}
	});

	socket.on("sendMessage", ({ senderId, receiverId, message }) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", { senderId, message });
		}
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

// Express middleware
app.use(
	cors({
		origin: "https://whatsapp-pre.vercel.app", // Frontend URL
		credentials: true, // Allow credentials (cookies)
	})
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
	res.json({
		message: `Server is running on port ${PORT}`,
	});
});

app.get("/api", (req, res) => {
	res.json({
		message: `Server is running for API on port ${PORT}`,
	});
});

app.get("/api/user", (req, res) => {
	res.json({
		message: `Server is running for API on port ${PORT}`,
		users: {
			name: "sumit",
			position: "developer",
		},
	});
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Start server
connectDb()
.then(()=>{
    server.listen(PORT, () => {
        // connectDb();
        console.log(`Server running on port ${PORT}`);
    });
    
})
