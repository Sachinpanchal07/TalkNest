import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const getOrCreateChat = async (senderId, receiverId) => {
    // Find a private chat where both are participants
    let chat = await Chat.findOne({
        isGroup: false,
        participants: { $all: [senderId, receiverId] }
    });

    if (!chat) {
        chat = await Chat.create({
            participants: [senderId, receiverId],
            isGroup: false
        });
    }
    return chat;
};

export const saveMessage = async (chatId, senderId, text) => {
    return await Message.create({ chatId, senderId, text });
};

export const getChatMessages = async (chatId) => {
    return await Message.find({ chatId }).sort({ createdAt: 1 });
};