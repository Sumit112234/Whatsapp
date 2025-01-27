import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';


import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";


import connectDb from './database/connectDb.js'
// import { app, server } from "./socket/socket.js";
import express from "express";

const app = express();

dotenv.config();

// const __dirname = path.resolve();
// // PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: 'https://whatsapp-pre.vercel.app', // Frontend URL
    credentials: true, // Allow credentials (cookies)
}));
app.use(express.json()); 
app.use(cookieParser());

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " + PORT
    })
})

app.get("/api",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running for api" + PORT
    })
})
app.get("/api/user",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running for api" + PORT,
        users : {
            name : "sumit",
            position : "developer"
        }
    })
})


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
	connectDb();
	console.log(`Server Running on port ${PORT}`);
});