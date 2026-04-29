// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
   getOrCreateConversationService,
   sendMessageService,
   getConversationMessagesService,
   getCustomerConversationsService,
   getAdminConversationsService,
   closeConversationService,
   markMessagesReadService,
} from "../services/chat.service.js";

// ====== CUSTOMER CONTROLLERS ======

// ------ START / GET CONVERSATION

const startConversation = asyncHandler(async (req, res) => {
   const conversation = await getOrCreateConversationService(req.user._id);

   return res
      .status(200)
      .json(
         new ApiResponse(200, conversation, "Conversation fetched successfully"),
      );
});

// ------ GET CUSTOMER CONVERSATIONS

const getCustomerConversations = asyncHandler(async (req, res) => {
   const conversations = await getCustomerConversationsService(req.user._id);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            conversations,
            "Conversations fetched successfully",
         ),
      );
});

// ------ GET MESSAGES

const getMessages = asyncHandler(async (req, res) => {
   const result = await getConversationMessagesService(
      req.params.id,
      req.user._id,
      req.user.role,
      req.query,
   );

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Messages fetched successfully"));
});

// ------ SEND MESSAGE (CUSTOMER)

const sendCustomerMessage = asyncHandler(async (req, res) => {
   const { content } = req.body;

   if (!content) {
      throw new ApiError(400, "Message content is required");
   }

   const message = await sendMessageService(
      req.params.id,
      req.user._id,
      "customer",
      content,
   );

   return res
      .status(201)
      .json(new ApiResponse(201, message, "Message sent successfully"));
});

// ------ MARK AS READ

const markAsRead = asyncHandler(async (req, res) => {
   const result = await markMessagesReadService(req.params.id, req.user._id);

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Messages marked as read"));
});

// ====== ADMIN CONTROLLERS ======

// ------ GET ALL CONVERSATIONS (ADMIN)

const getAdminConversations = asyncHandler(async (req, res) => {
   const result = await getAdminConversationsService(req.query);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            result,
            "Conversations fetched successfully",
         ),
      );
});

// ------ GET MESSAGES (ADMIN)

const getAdminMessages = asyncHandler(async (req, res) => {
   const result = await getConversationMessagesService(
      req.params.id,
      req.user._id,
      "admin",
      req.query,
   );

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Messages fetched successfully"));
});

// ------ SEND MESSAGE (ADMIN)

const sendAdminMessage = asyncHandler(async (req, res) => {
   const { content } = req.body;

   if (!content) {
      throw new ApiError(400, "Message content is required");
   }

   const message = await sendMessageService(
      req.params.id,
      req.user._id,
      "admin",
      content,
   );

   return res
      .status(201)
      .json(new ApiResponse(201, message, "Message sent successfully"));
});

// ------ CLOSE CONVERSATION (ADMIN)

const closeConversation = asyncHandler(async (req, res) => {
   const conversation = await closeConversationService(req.params.id);

   return res
      .status(200)
      .json(
         new ApiResponse(200, conversation, "Conversation closed successfully"),
      );
});

// ------ EXPORTING CONTROLLERS

export {
   startConversation,
   getCustomerConversations,
   getMessages,
   sendCustomerMessage,
   markAsRead,
   getAdminConversations,
   getAdminMessages,
   sendAdminMessage,
   closeConversation,
};
