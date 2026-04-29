import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import {
   startConversation,
   getCustomerConversations,
   getMessages,
   sendCustomerMessage,
   markAsRead,
} from "../controllers/chat.controller.js";

// ------ START / GET CONVERSATION

router.post("/conversations", verifyJWT, startConversation);

// ------ GET CUSTOMER CONVERSATIONS

router.get("/conversations", verifyJWT, getCustomerConversations);

// ------ GET MESSAGES

router.get("/conversations/:id/messages", verifyJWT, getMessages);

// ------ SEND MESSAGE

router.post("/conversations/:id/messages", verifyJWT, sendCustomerMessage);

// ------ MARK AS READ

router.patch("/conversations/:id/read", verifyJWT, markAsRead);

// ------ EXPORTING ROUTER

export default router;
