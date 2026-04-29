import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";

// ------ GET ALL ORDERS (ADMIN)

const getAllOrdersService = async (query) => {
   // ------ pagination
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
   const skip = (page - 1) * limit;

   // ------ filter object
   const filter = {};

   // ------ filter by order status
   const allowedStatus = ["pending", "paid", "shipped", "delivered", "cancelled"];

   if (query.status && allowedStatus.includes(query.status)) {
      filter.status = query.status;
   }

   // ------ filter by payment status
   const allowedPaymentStatus = ["pending", "paid", "failed"];

   if (query.paymentStatus && allowedPaymentStatus.includes(query.paymentStatus)) {
      filter.paymentStatus = query.paymentStatus;
   }

   // ------ fetching orders
   const orders = await Order.find(filter)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

   // ------ counting total orders
   const totalOrders = await Order.countDocuments(filter);

   return {
      orders,
      totalOrders,
      page,
      totalPages: Math.ceil(totalOrders / limit),
   };
};

// ------ GET SINGLE ORDER (ADMIN)

const getAdminSingleOrderService = async (orderId) => {
   // ------ validate mongodb id
   if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
   }

   // ------ find order with user details
   const order = await Order.findById(orderId).populate(
      "user",
      "firstName lastName email phoneNo",
   );

   if (!order) {
      throw new ApiError(404, "Order not found");
   }

   return order;
};

// ------ EXPORTING SERVICES

export { getAllOrdersService, getAdminSingleOrderService };
