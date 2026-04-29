import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// ------ IMPORTING FROM FILES

import { ACCESS_TOKEN_SECRET, FRONTEND_URI } from "../constants.js";
import User from "../models/user.model.js";
import {
   sendMessageService,
   markMessagesReadService,
} from "../services/chat.service.js";

// ------ INITIALIZE SOCKET.IO

const initializeSocket = (httpServer) => {
   const io = new Server(httpServer, {
      cors: {
         origin: FRONTEND_URI,
         credentials: true,
      },
   });

   // ====== JWT AUTH MIDDLEWARE FOR SOCKET ======

   io.use(async (socket, next) => {
      try {
         const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];

         if (!token) {
            return next(new Error("Authentication required"));
         }

         const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
         const user = await User.findById(decoded._id);

         if (!user) {
            return next(new Error("User not found"));
         }

         // ------ attach user to socket
         socket.user = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
         };

         next();
      } catch (error) {
         next(new Error("Invalid or expired token"));
      }
   });

   // ====== CONNECTION HANDLER ======

   io.on("connection", (socket) => {
      console.log(
         `(SOCKET CONNECTED) ${socket.user.firstName} [${socket.user.role}]`,
      );

      // ------ JOIN CONVERSATION ROOM

      socket.on("joinConversation", (conversationId) => {
         socket.join(conversationId);
         console.log(
            `(SOCKET JOINED) ${socket.user.firstName} → Room: ${conversationId}`,
         );
      });

      // ------ LEAVE CONVERSATION ROOM

      socket.on("leaveConversation", (conversationId) => {
         socket.leave(conversationId);
      });

      // ------ SEND MESSAGE (REAL-TIME)

      socket.on("sendMessage", async (data) => {
         try {
            const { conversationId, content } = data;

            if (!conversationId || !content) return;

            // ------ save message via service
            const message = await sendMessageService(
               conversationId,
               socket.user._id,
               socket.user.role,
               content,
            );

            // ------ emit to all users in the conversation room
            io.to(conversationId).emit("newMessage", message);

            // ------ emit conversation update for listing pages
            io.emit("conversationUpdated", {
               conversationId,
               lastMessage: content.substring(0, 100),
               lastMessageAt: new Date(),
               senderRole: socket.user.role,
            });
         } catch (error) {
            socket.emit("messageError", {
               message: error.message || "Failed to send message",
            });
         }
      });

      // ------ TYPING INDICATOR

      socket.on("typing", (conversationId) => {
         socket.to(conversationId).emit("userTyping", {
            userId: socket.user._id,
            firstName: socket.user.firstName,
            role: socket.user.role,
         });
      });

      // ------ STOP TYPING

      socket.on("stopTyping", (conversationId) => {
         socket.to(conversationId).emit("userStoppedTyping", {
            userId: socket.user._id,
         });
      });

      // ------ MARK MESSAGES AS READ

      socket.on("markRead", async (conversationId) => {
         try {
            await markMessagesReadService(conversationId, socket.user._id);

            socket.to(conversationId).emit("messagesRead", {
               conversationId,
               readBy: socket.user._id,
            });
         } catch (error) {
            socket.emit("messageError", {
               message: "Failed to mark messages as read",
            });
         }
      });

      // ------ DISCONNECT

      socket.on("disconnect", () => {
         console.log(
            `(SOCKET DISCONNECTED) ${socket.user.firstName} [${socket.user.role}]`,
         );
      });
   });

   return io;
};

export default initializeSocket;
