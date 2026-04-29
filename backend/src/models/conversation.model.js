import { Schema, model } from "mongoose";

// ------ CONVERSATION SCHEMA

const conversationSchema = new Schema(
   {
      customer: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      admin: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },
      status: {
         type: String,
         enum: ["open", "closed"],
         default: "open",
      },
      lastMessage: {
         type: String,
      },
      lastMessageAt: {
         type: Date,
      },
   },
   {
      timestamps: true,
   },
);

// ------ INDEXES

conversationSchema.index({ customer: 1 });
conversationSchema.index({ status: 1, lastMessageAt: -1 });

// ------ CONVERSATION MODEL

const Conversation = model("Conversation", conversationSchema);
export default Conversation;
