import express, { urlencoded } from "express"
import { Router } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getOrCreateChat } from "./services/chat.service.js";
import Message from "./models/message.model.js";
import  authRouter  from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";
import http from 'http';
import {Server} from 'socket.io';
import chatRouter from "./routes/chat.route.js";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cookieParser());
app.use(express.urlencoded({extended : true}))
app.use(express.json());


const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // tell everyone who is online

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // sendMessage listner
    socket.on("sendMessage", async ({ senderId, receiverId, text, tempId }) => {
        try {
        const chat = await getOrCreateChat(senderId, receiverId);

        const newMessage = await Message.create({
            chatId: chat._id,
            senderId: senderId,
            text: text,
            status: 'sent'
        });

        const savedMessage = {
            ...newMessage.toObject(),
            tempId
        };

        // Send to Receiver if they are online
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", savedMessage);
        }
        
        // send back to sender to confirm it was saved
        socket.emit("messageSent", savedMessage);

    } catch (err) {
        console.error("Socket Message Error:", err);
    }
    });
});

app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

export default httpServer;
