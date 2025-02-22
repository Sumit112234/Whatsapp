import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from 'path';
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";

import connectDb from "./database/connectDb.js";
import User from "./models/user.js";
import { app, server } from "./socket/socket.js";

dotenv.config();


// Express app setup
// const app = express();

// HTTP server and Socket.IO setup
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [process.env.FRONTEND_URL,'http://localhost:5173'],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Endpoints
// app.get("/", (req, res) => {
//   res.json({ message: `Server is running on port ${process.env.PORT}` });
// });

app.get("/api", (req, res) => {
  res.json({ message: `Server API running on port ${process.env.PORT}` });
});

app.get("/api/user", async (req, res) => {
  const users = await User.find();
  res.json({ message: `Users fetched successfully`, users });
});



// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

//deployment
// const __dirname = path.resolve();

// if(process.env.NODE_ENV === "production")
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

// Database connection and server start
connectDb()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      //console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
