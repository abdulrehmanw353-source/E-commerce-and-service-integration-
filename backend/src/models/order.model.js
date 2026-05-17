import { Schema, model } from "mongoose";

// ------ ORDER ITEM SNAPSHOT

const orderItemSchema = new Schema(
   {
      product: {
         type: Schema.Types.ObjectId,
         ref: "Product",
         required: true,
      },
      title: String,
      price: Number,
      quantity: Number,
      image: String,
   },
   { _id: false },
);

// ------ ORDER SCHEMA

const orderSchema = new Schema(
   {
      user: {
         type: Schema.Types.ObjectId,
         ref: "User",
         default: null,
      },

      items: [orderItemSchema],

      totalAmount: {
         type: Number,
         required: true,
      },

      status: {
         type: String,
         enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
         default: "pending",
      },

      paymentStatus: {
         type: String,
         enum: ["pending", "paid", "failed"],
         default: "pending",
      },
      
      shippingAddress: {
         street: String,
         city: String,
         state: String,
         zip: String,
         country: String,
         lat: Number,
         lng: Number,
      },
      
      contact: {
         firstName: String,
         lastName: String,
         email: String,
         phone: String,
      },

      paymentMethod: {
         type: String,
         enum: ["cod", "jazzcash", "easypaisa", "bank"],
         default: "cod",
      },
   },
   {
      timestamps: true,
   },
);

// ------ ORDER MODEL

const Order = model("Order", orderSchema);
export default Order;
