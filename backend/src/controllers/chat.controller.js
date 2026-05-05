import { getOrCreateChat, getChatMessages } from "../services/chat.service.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export async function getChatHistoryController(req, res) {
    try {
        const senderId = req.user._id;
        const { receiverId } = req.params;

        const chat = await getOrCreateChat(senderId, receiverId);

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


// Create a new group chat
export const createGroupChat = async (req, res) => {
    try {
        const { groupName, users } = req.body;

        if (!groupName || !users || users.length === 0) {
            return res.status(400).json({ message: "Please provide a group name and select members" });
        }

        // Add the logged-in user (admin) to the participants array
        const participantIds = [...users, req.user._id];

        const groupChat = await Chat.create({
            groupName: groupName,
            isGroup: true,
            participants: participantIds,
            admin: req.user._id
        });

        // fetch the created group and populate user details so frontend has names/avatars
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("participants", "-password")
            .populate("admin", "-password");

            ("full group chat", fullGroupChat)
        res.status(201).json({ success: true, group: fullGroupChat });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Failed to create group" });
    }
};

// Fetch all groups for the login user
export const fetchGroups = async (req, res) => {
    try {
        const groups = await Chat.find({
            isGroup: true,
            participants: { $in: [req.user._id] } 
        })
        .populate("participants", "-password")
        .populate("admin", "-password")
        .sort({ updatedAt: -1 });
        console.log('Groups in fetch gropu', groups);
        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ message: "Failed to fetch groups" });
    }
};

// get group mssges
export const getGroupMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Group not found" });
        }

        const messages = await Message.find({ chatId })
            .populate("senderId", "username avatar") 
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching group messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};