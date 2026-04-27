// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   createOrderFromCartService,
   getUserOrdersService,
   getSingleOrderService,
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

// ------ EXPORTING CONTROLLERS

export { createOrder, getUserOrders, getSingleOrder };
