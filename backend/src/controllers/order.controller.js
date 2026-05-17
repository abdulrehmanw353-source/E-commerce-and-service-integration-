// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
   createOrderFromCartService,
   createGuestOrderService,
   getUserOrdersService,
   getSingleOrderService,
   updateOrderStatusService,
} from "../services/order.service.js";

// ------ CREATE ORDER

const createOrder = asyncHandler(async (req, res) => {
   const { shippingAddress, contact, paymentMethod } = req.body;
   const order = await createOrderFromCartService(req.user._id, shippingAddress, contact, paymentMethod);

   return res
      .status(201)
      .json(new ApiResponse(201, order, "Order created successfully"));
});

// ------ GET USER ORDERS

const getUserOrders = asyncHandler(async (req, res) => {
   const orders = await getUserOrdersService(req.user._id);

   return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// ------ GET SINGLE ORDER

const getSingleOrder = asyncHandler(async (req, res) => {
   const order = await getSingleOrderService(req.params.id, req.user._id);

   return res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// ------ UPDATE ORDER STATUS

const updateOrderStatus = asyncHandler(async (req, res) => {
   const { status, paymentStatus } = req.body;

   if (!status && !paymentStatus) {
      throw new ApiError(400, "status or paymentStatus is required");
   }

   const order = await updateOrderStatusService(
      req.params.id,
      status,
      paymentStatus,
   );

   return res
      .status(200)
      .json(new ApiResponse(200, order, "Order status updated successfully"));
});

// ------ CREATE GUEST ORDER (NO AUTH)

const createGuestOrder = asyncHandler(async (req, res) => {
   const { shippingAddress, contact, items, paymentMethod } = req.body;

   if (!items || items.length === 0) {
      throw new ApiError(400, "Cart items are required");
   }
   if (!contact?.email || !contact?.firstName || !contact?.phone) {
      throw new ApiError(400, "Contact info (firstName, email, phone) is required");
   }
   if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.country) {
      throw new ApiError(400, "Shipping address (street, city, country) is required");
   }

   const order = await createGuestOrderService(items, shippingAddress, contact, paymentMethod);

   return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
});

// ------ CANCEL ORDER (CUSTOMER — only pending)

const cancelOrder = asyncHandler(async (req, res) => {
   const order = await getSingleOrderService(req.params.id, req.user._id);

   if (order.status !== "pending") {
      throw new ApiError(400, "Only pending orders can be cancelled");
   }

   order.status = "cancelled";
   await order.save();

   return res
      .status(200)
      .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

// ------ EXPORTING CONTROLLERS

export { createOrder, createGuestOrder, cancelOrder, getUserOrders, getSingleOrder, updateOrderStatus };
