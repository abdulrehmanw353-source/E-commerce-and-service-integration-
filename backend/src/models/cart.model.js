import { Schema, model } from "mongoose";

// ------ CART ITEM SUB-SCHEMA

const cartItemSchema = new Schema(
   {
      product: {
         type: Schema.Types.ObjectId,
         ref: "Product",
         required: true,
      },
      quantity: {
         type: Number,
         required: true,
         min: 1,
         default: 1,
      },
      price: {
         type: Number,
         required: true,
      },
   },
   { _id: false },
);

// ------ CART SCHEMA

const cartSchema = new Schema(
   {
      user: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
         unique: true, // one cart per user
      },
      items: [cartItemSchema],
   },
   {
      timestamps: true,
   },
);

// ------ CART MODEL

const Cart = model("Cart", cartSchema);
export default Cart;
