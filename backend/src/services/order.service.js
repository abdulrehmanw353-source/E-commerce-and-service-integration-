import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// ------ CREATE ORDER FROM CART

const createOrderFromCartService = async (userId) => {
   // ------ get cart
   const cart = await Cart.findOne({ user: userId }).populate("items.product");

   if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
   }

   let totalAmount = 0;

   const orderItems = [];

   // ------ validate each item
   for (const item of cart.items) {
      const product = item.product;

      if (!product || product.isDeleted) {
         throw new ApiError(404, "Product not found in cart");
      }

      // ------ stock validation
      if (product.stock < item.quantity) {
         throw new ApiError(400, `Insufficient stock for ${product.title}`);
      }

      // ------ reduce stock
      product.stock -= item.quantity;
      await product.save();

      // ------ calculate total
      totalAmount += item.price * item.quantity;

      // ------ push snapshot
      orderItems.push({
         product: product._id,
         title: product.title,
         price: item.price,
         quantity: item.quantity,
         image: product.images?.[0],
      });
   }

   // ------ create order
   const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
   });

   // ------ clear cart
   cart.items = [];
   await cart.save();

   return order;
};

// ------ GET USER ORDERS

const getUserOrdersService = async (userId) => {
   const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
   });

   return orders;
};

// ------ GET SINGLE ORDER

const getSingleOrderService = async (orderId, userId) => {
   if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
   }

   const order = await Order.findOne({
      _id: orderId,
      user: userId,
   });

   if (!order) {
      throw new ApiError(404, "Order not found");
   }

   return order;
};

// ------ EXPORTING SERVICES

export {
   createOrderFromCartService,
   getUserOrdersService,
   getSingleOrderService,
};
