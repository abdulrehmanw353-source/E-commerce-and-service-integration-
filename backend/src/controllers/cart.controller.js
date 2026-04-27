// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { addToCartService, getCartService } from "../services/cart.service.js";

// ------ ADD TO CART

const addToCart = asyncHandler(async (req, res) => {
   const { productId, quantity } = req.body;

   if (!productId || !quantity) {
      throw new ApiError(400, "productId and quantity are required");
   }

   const qty = Number(quantity);

   if (!qty || qty <= 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
   }

   const cart = await addToCartService(req.user._id, productId, qty);

   return res
      .status(200)
      .json(new ApiResponse(200, cart, "Product added to cart"));
});

// ------ GET CART

const getCart = asyncHandler(async (req, res) => {
   const cart = await getCartService(req.user._id);

   return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// ------ EXPORTING CONTROLLERS

export { addToCart, getCart };
