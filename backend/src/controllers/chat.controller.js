import { getOrCreateChat, getChatMessages } from "../services/chat.service.js";

export async function getChatHistoryController(req, res) {
    try {
        const senderId = req.user._id;
        const { receiverId } = req.params;

        // 1. Get or Create the chat room for these two people
        const chat = await getOrCreateChat(senderId, receiverId);

        // 2. Fetch all messages belonging to this chat
        const messages = await getChatMessages(chat._id);

        res.status(200).json({
            success: true,
            chatId: chat._id,
            messages
        });
    } catch (err) {
        console.error("Chat History Error:", err);
        res.status(500).json({ message: "Failed to load messages" });
    }
}