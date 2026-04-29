// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   getAllOrdersService,
   getAdminSingleOrderService,
} from "../services/admin.order.service.js";

// ------ GET ALL ORDERS (ADMIN)

const getAllOrders = asyncHandler(async (req, res) => {
   const result = await getAllOrdersService(req.query);

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Orders fetched successfully"));
});

// ------ GET SINGLE ORDER (ADMIN)

const getAdminSingleOrder = asyncHandler(async (req, res) => {
   const order = await getAdminSingleOrderService(req.params.id);

   return res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// ------ EXPORTING CONTROLLERS

export { getAllOrders, getAdminSingleOrder };
