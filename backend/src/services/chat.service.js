import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";

// ------ GET OR CREATE CONVERSATION (CUSTOMER)

const getOrCreateConversationService = async (customerId) => {
   // ------ check for existing open conversation
   let conversation = await Conversation.findOne({
      customer: customerId,
      status: "open",
   }).populate("admin", "firstName lastName");

   // ------ create new if none exists
   if (!conversation) {
      conversation = await Conversation.create({
         customer: customerId,
         status: "open",
      });
   }

   return conversation;
};

// ------ SEND MESSAGE

const sendMessageService = async (
   conversationId,
   senderId,
   senderRole,
   content,
) => {
   if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(400, "Invalid conversation ID");
   }

   if (!content || content.trim().length === 0) {
      throw new ApiError(400, "Message content is required");
   }

   const conversation = await Conversation.findById(conversationId);

   if (!conversation) {
      throw new ApiError(404, "Conversation not found");
   }

   if (conversation.status === "closed") {
      throw new ApiError(400, "Cannot send message to a closed conversation");
   }

   // ------ create message
   const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      senderRole,
      content: content.trim(),
   });

   // ------ update conversation's last message
   conversation.lastMessage = content.trim().substring(0, 100);
   conversation.lastMessageAt = new Date();
   await conversation.save();

   // ------ return populated message
   const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "firstName lastName",
   );

   return populatedMessage;
};

// ------ GET CONVERSATION MESSAGES (PAGINATED)

const getConversationMessagesService = async (
   conversationId,
   userId,
   userRole,
   query,
) => {
   if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(400, "Invalid conversation ID");
   }

   const conversation = await Conversation.findById(conversationId);

   if (!conversation) {
      throw new ApiError(404, "Conversation not found");
   }

   // ------ customers can only see their own conversations
   if (
      userRole === "customer" &&
      conversation.customer.toString() !== userId.toString()
   ) {
      throw new ApiError(403, "Access denied");
   }

   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
   const skip = (page - 1) * limit;

   const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

   const totalMessages = await Message.countDocuments({
      conversation: conversationId,
   });

   return {
      messages,
      totalMessages,
      page,
      totalPages: Math.ceil(totalMessages / limit),
   };
};

// ------ GET CUSTOMER CONVERSATIONS

const getCustomerConversationsService = async (customerId) => {
   const conversations = await Conversation.find({ customer: customerId })
      .populate("admin", "firstName lastName")
      .sort({ lastMessageAt: -1 });

   return conversations;
};

// ------ GET ADMIN CONVERSATIONS (ALL)

const getAdminConversationsService = async (query) => {
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
   const skip = (page - 1) * limit;

   const filter = {};

   if (query.status && ["open", "closed"].includes(query.status)) {
      filter.status = query.status;
   }

   const conversations = await Conversation.find(filter)
      .populate("customer", "firstName lastName email")
      .populate("admin", "firstName lastName")
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit);

   const totalConversations = await Conversation.countDocuments(filter);

   return {
      conversations,
      totalConversations,
      page,
      totalPages: Math.ceil(totalConversations / limit),
   };
};

// ------ CLOSE CONVERSATION (ADMIN)

const closeConversationService = async (conversationId) => {
   if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(400, "Invalid conversation ID");
   }

   const conversation = await Conversation.findById(conversationId);

   if (!conversation) {
      throw new ApiError(404, "Conversation not found");
   }

   if (conversation.status === "closed") {
      throw new ApiError(400, "Conversation is already closed");
   }

   conversation.status = "closed";
   await conversation.save();

   return conversation;
};

// ------ MARK MESSAGES AS READ

const markMessagesReadService = async (conversationId, userId) => {
   if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(400, "Invalid conversation ID");
   }

   // ------ mark all unread messages NOT sent by this user as read
   const result = await Message.updateMany(
      {
         conversation: conversationId,
         sender: { $ne: userId },
         isRead: false,
      },
      { isRead: true },
   );

   return { markedAsRead: result.modifiedCount };
};

// ------ EXPORTING SERVICES

export {
   getOrCreateConversationService,
   sendMessageService,
   getConversationMessagesService,
   getCustomerConversationsService,
   getAdminConversationsService,
   closeConversationService,
   markMessagesReadService,
};
