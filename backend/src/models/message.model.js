import { Schema, model } from "mongoose";

// ------ MESSAGE SCHEMA

const messageSchema = new Schema(
   {
      conversation: {
         type: Schema.Types.ObjectId,
         ref: "Conversation",
         required: true,
      },
      sender: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      senderRole: {
         type: String,
         enum: ["customer", "admin"],
         required: true,
      },
      content: {
         type: String,
         required: true,
         trim: true,
         maxlength: 2000,
      },
      isRead: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   },
);

// ------ INDEXES

messageSchema.index({ conversation: 1, createdAt: 1 });

// ------ MESSAGE MODEL

const Message = model("Message", messageSchema);
export default Message;
