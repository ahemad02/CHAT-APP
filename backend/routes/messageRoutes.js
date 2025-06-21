import express from "express";

import { protectedRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectedRoute, getUsersForSidebar);
messageRouter.get("/:id", protectedRoute, getMessages);
messageRouter.put("/mark/:id", protectedRoute, markMessagesAsSeen);
messageRouter.post("/send/:id", protectedRoute, sendMessage);


export default messageRouter;