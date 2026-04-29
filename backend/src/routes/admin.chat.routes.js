import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
   getAdminConversations,
   getAdminMessages,
   sendAdminMessage,
   closeConversation,
} from "../controllers/chat.controller.js";

// ------ GET ALL CONVERSATIONS

router.get(
   "/conversations",
   verifyJWT,
   authorizeRoles("admin"),
   getAdminConversations,
);

// ------ GET MESSAGES

router.get(
   "/conversations/:id/messages",
   verifyJWT,
   authorizeRoles("admin"),
   getAdminMessages,
);

// ------ SEND MESSAGE (ADMIN REPLY)

router.post(
   "/conversations/:id/messages",
   verifyJWT,
   authorizeRoles("admin"),
   sendAdminMessage,
);

// ------ CLOSE CONVERSATION

router.patch(
   "/conversations/:id/close",
   verifyJWT,
   authorizeRoles("admin"),
   closeConversation,
);

// ------ EXPORTING ROUTER

export default router;
