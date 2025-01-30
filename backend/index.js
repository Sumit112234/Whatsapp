import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";

import connectDb from "./database/connectDb.js";
import User from "./models/user.js";

dotenv.config();

// Express app setup
const app = express();
const server = http.createServer(app);

if (!global.io) {
  global.io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
}

const io = global.io; // Prevent multiple instances

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.get("/", (req, res) => {
  res.json({ message: `Server is running on port ${process.env.PORT}` });
});
// Socket.IO functionality
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};


const userSocketMap = {}; // Map to store connected users and their socket IDs
app.get("/api/user", async (req, res) => {
    const users = await User.find();
    res.json({ message: `Users fetched successfully`, users });
  });
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Save user ID with their socket ID
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Broadcast list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle "typing" event
  // socket.on("typing", ({ senderId, receiverId }) => {
  //   const receiverSocketId = getReceiverSocketId(receiverId);
  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit("typing", senderId);
  //   }
  // });
  socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", senderId);
      }
      });

  // Handle "sendMessage" event
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { senderId, message });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    for (const id in userSocketMap) {
      if (userSocketMap[id] === socket.id) {
        delete userSocketMap[id];
        break;
      }
    }

    // Update online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Database connection and server start
connectDb()
  .then(() => {
    if (!server.listening) {  // ✅ Ensure the server isn't already running
      const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

export { io , getReceiverSocketId};
export default server;


// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";

// import authRoutes from "./routes/auth.js";
// import messageRoutes from "./routes/message.js";
// import userRoutes from "./routes/user.js";

// import connectDb from "./database/connectDb.js";
// import User from "./models/user.js";

// dotenv.config();

// // Express app setup
// const app = express();

// // HTTP server and Socket.IO setup
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [process.env.FRONTEND_URL,'http://localhost:5173'],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Middleware
// app.use(cors({
//   origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// // API Endpoints
// app.get("/", (req, res) => {
//   res.json({ message: `Server is running on port ${process.env.PORT}` });
// });

// app.get("/api", (req, res) => {
//   res.json({ message: `Server API running on port ${process.env.PORT}` });
// });

// app.get("/api/user", async (req, res) => {
//   const users = await User.find();
//   res.json({ message: `Users fetched successfully`, users });
// });

// // Use routes
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);

// // Socket.IO functionality
//  const getReceiverSocketId = (receiverId) => {
//   return userSocketMap[receiverId];
// };


// const userSocketMap = {}; // Map to store connected users and their socket IDs

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Save user ID with their socket ID
//   const userId = socket.handshake.query.userId;
//   if (userId && userId !== "undefined") {
//     userSocketMap[userId] = socket.id;
//   }

//   // Broadcast list of online users
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // Handle "typing" event
//   // socket.on("typing", ({ senderId, receiverId }) => {
//   //   const receiverSocketId = getReceiverSocketId(receiverId);
//   //   if (receiverSocketId) {
//   //     io.to(receiverSocketId).emit("typing", senderId);
//   //   }
//   // });
//   socket.on("typing", ({ senderId, receiverId }) => {
//       const receiverSocketId = getReceiverSocketId(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("typing", senderId);
//       }
//       });

//   // Handle "sendMessage" event
//   socket.on("sendMessage", ({ senderId, receiverId, message }) => {
//     const receiverSocketId = userSocketMap[receiverId];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", { senderId, message });
//     }
//   });

//   // Handle user disconnection
//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);

//     for (const id in userSocketMap) {
//       if (userSocketMap[id] === socket.id) {
//         delete userSocketMap[id];
//         break;
//       }
//     }

//     // Update online users
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// // Database connection and server start
// connectDb()
//   .then(() => {
//     const PORT = process.env.PORT || 5000;
//     server.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Database connection failed:", err);
//   });

// export { getReceiverSocketId, io };
// export default server;

// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from 'cors';


// import authRoutes from "./routes/auth.js";
// import messageRoutes from "./routes/message.js";
// import userRoutes from "./routes/user.js";


// import connectDb from './database/connectDb.js'
// import { app, server } from "./socket/socket.js";
// import User from "./models/user.js";


// // const app = express();

// dotenv.config();

// // const __dirname = path.resolve();
// // // PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
// const PORT = process.env.PORT || 5000;
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true, // Allow credentials (cookies)
// }));
// app.use(express.json()); 
// app.use(cookieParser());

// app.get("/",(request,response)=>{
//     ///server to client
//     response.json({
//         message : "Server is running " + PORT
//     })
// })

// app.get("/api",(request,response)=>{
//     ///server to client
//     response.json({
//         message : "Server is running for api" + PORT
//     })
// })
// app.get("/api/user",async(request,response)=>{
//     let users = await User.find();
//     ///server to client
//     response.json({
//         message : "Server is running for api" + PORT,
//         users
//     })
// })


// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);


// connectDb().
// then(()=>{
//     server.listen(PORT, () => {
//         console.log(`Server Running on port ${PORT}`);
//     });
// })