import { Router } from "express";
import { getChatHistoryController, createGroupChat, fetchGroups } from "../controllers/chat.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

// route to get history with a specific user
chatRouter.get("/history/:receiverId", userAuth, getChatHistoryController);
chatRouter.post("/group", userAuth, createGroupChat);
chatRouter.get("/groups", userAuth, fetchGroups);

export default chatRouter;