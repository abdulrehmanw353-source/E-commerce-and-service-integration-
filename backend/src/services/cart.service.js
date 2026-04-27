import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// ------ ADD TO CART SERVICE

const addToCartService = async (userId, productId, quantity) => {
   if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
   }

   const product = await Product.findById(productId);

   if (!product || product.isDeleted) {
      throw new ApiError(404, "Product not found");
   }

   let cart = await Cart.findOne({ user: userId });

   if (!cart) {
      cart = await Cart.create({
         user: userId,
         items: [],
      });
   }

   const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
   );

   // ------ calculate current quantity in cart
   const existingQty =
      existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;

   const newTotalQty = existingQty + quantity;

   // ------ stock validation (FIXED)
   if (product.stock < newTotalQty) {
      throw new ApiError(400, `Only ${product.stock} items available in stock`);
   }

   if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = newTotalQty;
   } else {
      cart.items.push({
         product: productId,
         quantity,
         price: product.price,
      });
   }

   await cart.save();

   // ------ return populated cart
   const updatedCart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price images stock",
   );

   return updatedCart;
};

// ------ GET CART SERVICE

const getCartService = async (userId) => {
   const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price images stock",
   );

   if (!cart) {
      return { user: userId, items: [] };
   }

   return cart;
};

// ------ UPDATE CART ITEM

const updateCartItemService = async (userId, productId, quantity) => {
   if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
   }

   const cart = await Cart.findOne({ user: userId });

   if (!cart) {
      throw new ApiError(404, "Cart not found");
   }

   const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
   );

   if (itemIndex === -1) {
      throw new ApiError(404, "Product not found in cart");
   }

   if (quantity <= 0) {
      // remove if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
   } else {
      cart.items[itemIndex].quantity = quantity;
   }

   await cart.save();

   return await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price images stock",
   );
};

// ------ REMOVE ITEM FROM CART

const removeFromCartService = async (userId, productId) => {
   if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
   }

   const cart = await Cart.findOne({ user: userId });

   if (!cart) {
      throw new ApiError(404, "Cart not found");
   }

   cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
   );

   await cart.save();

   return await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price images stock",
   );
};

// ------ CLEAR CART

const clearCartService = async (userId) => {
   const cart = await Cart.findOne({ user: userId });

   if (!cart) {
      throw new ApiError(404, "Cart not found");
   }

   cart.items = [];

   await cart.save();

   return cart;
};

// ------EXPORTING SERVICES

export {
   addToCartService,
   getCartService,
   updateCartItemService,
   removeFromCartService,
   clearCartService,
};
