// import { io } from "../app.js";
import { getOrCreateChat } from "../services/chat.service.js";
import Message from "../models/message.model.js";


const userSocketMap = {}; // userId : socket

export function callSocket(io){

    // make sokcet connection
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId !== "undefined") userSocketMap[userId] = socket.id;
        // console.log(userId, "socketId is ", socket.id);
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap));  
    
        socket.on("joinGroups", (groupIds) => { // groupIds is an array
            if (Array.isArray(groupIds)) {
                groupIds.forEach(id => socket.join(id));

            }
        });
    
        // on socket disconnect
        socket.on("disconnect", () => {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    
        // send message
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
    
                // check group
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

}
