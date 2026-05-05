import { Router } from "express";
import { getChatHistoryController, createGroupChat, fetchGroups, getGroupMessages } from "../controllers/chat.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

// route to get history with a specific user
chatRouter.get("/history/:receiverId", userAuth, getChatHistoryController);
chatRouter.post("/group", userAuth, createGroupChat);
chatRouter.get("/groups", userAuth, fetchGroups);
chatRouter.get("/group/messages/:chatId", userAuth, getGroupMessages);

export default chatRouter;