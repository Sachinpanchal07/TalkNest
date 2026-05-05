import express from "express"
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
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("joinGroups", (groupIds) => { // groupIds is an array
        if (Array.isArray(groupIds)) {
            groupIds.forEach(id => socket.join(id));
            (`User ${userId} joined rooms:`, groupIds);
        }
    });

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("sendMessage", async ({ senderId, receiverId, chatId, text, isGroup }) => {
        try {
            let finalChatId = chatId;

            if (!isGroup && !finalChatId) {
                const chat = await getOrCreateChat(senderId, receiverId);
                finalChatId = chat._id;
            }

            const newMessage = await Message.create({
                chatId: finalChatId,
                senderId: senderId,
                text: text,
                status: 'sent'
            });

            const savedMessage = { ...newMessage.toObject(), receiverId, isGroup };

            if (isGroup) {
                io.to(finalChatId).emit("newMessage", savedMessage);
            } else {
                const receiverSocketId = userSocketMap[receiverId];
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newMessage", savedMessage);
                }
                socket.emit("messageSent", savedMessage);
            }

        } catch (err) {
            console.error("Socket Message Error:", err);
        }
    });
});

// io.on("connection", (socket) => {
//     const userId = socket.handshake.query.userId;
//     if (userId !== "undefined") userSocketMap[userId] = socket.id;
    
//     io.emit("getOnlineUsers", Object.keys(userSocketMap)); // tell everyone who is online

//     socket.on("disconnect", () => {
//         delete userSocketMap[userId];
//         io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });

//     // sendMessage listner
//     socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
//         try {
//         const chat = await getOrCreateChat(senderId, receiverId);

//         const newMessage = await Message.create({
//             chatId: chat._id,
//             senderId: senderId,
//             text: text,
//             status: 'sent'
//         });

//         const savedMessage = {
//             ...newMessage.toObject(),
//             receiverId
//         };

//         // Send to Receiver if they are online
//         const receiverSocketId = userSocketMap[receiverId];
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("newMessage", savedMessage);
//         }
        
//         // send back to sender to confirm it was saved
//         socket.emit("messageSent", savedMessage);

//     } catch (err) {
//         console.error("Socket Message Error:", err);
//     }
//     });
// });

// io.on("connection", (socket) => {
//     const userId = socket.handshake.query.userId;
//     if (userId !== "undefined") userSocketMap[userId] = socket.id;
    
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     // --- NEW: Join Group Rooms ---
//     // When a user connects, find all their group chats and join those rooms
//     socket.on("joinGroups", (groupIds) => {
//         groupIds.forEach(id => {
//             socket.join(id);
//             (`User ${userId} joined room: ${id}`);
//         });
//     });

//     socket.on("disconnect", () => {
//         delete userSocketMap[userId];
//         io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });

//     // --- UPDATED: sendMessage listener ---
//     socket.on("sendMessage", async ({ senderId, chatId, text, isGroup }) => {
//         try {
//             // Save message to DB (Your Message model uses chatId)
//             const newMessage = await Message.create({
//                 chatId: chatId,
//                 senderId: senderId,
//                 text: text,
//                 status: 'sent'
//             });

//             const savedMessage = newMessage.toObject();

//             if (isGroup) {
//                 // For Group: Emit to everyone in the room (including sender)
//                 io.to(chatId).emit("newMessage", savedMessage);
//             } else {
//                 // For 1-on-1: Existing logic (using userSocketMap)
//                 const receiverId = savedMessage.receiverId; // Ensure this is sent from frontend for 1-on-1
//                 const receiverSocketId = userSocketMap[receiverId];
//                 if (receiverSocketId) {
//                     io.to(receiverSocketId).emit("newMessage", savedMessage);
//                 }
//                 socket.emit("messageSent", savedMessage);
//             }
//         } catch (err) {
//             console.error("Socket Error:", err);
//         }
//     });
// });

app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

export default httpServer;
