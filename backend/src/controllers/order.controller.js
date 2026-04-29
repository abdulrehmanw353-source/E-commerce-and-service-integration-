// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
   createOrderFromCartService,
   getUserOrdersService,
   getSingleOrderService,
   updateOrderStatusService,
} from "../services/order.service.js";

// ------ CREATE ORDER

const createOrder = asyncHandler(async (req, res) => {
   const order = await createOrderFromCartService(req.user._id);

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

// ------ EXPORTING CONTROLLERS

export { createOrder, getUserOrders, getSingleOrder, updateOrderStatus };
