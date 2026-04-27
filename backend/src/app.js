import express, { urlencoded } from "express"
import { Router } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { signupController } from "./controllers/auth.controller.js";
import  authRouter  from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";
import http from 'http';
import {Server} from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;

    // Tell everyone who is online
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // We will add the "send_message" listener here later
});

app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));

app.use(cookieParser());
app.use(express.urlencoded({extended : true}))
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default httpServer;