// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
   addToCartService,
   getCartService,
   updateCartItemService,
   removeFromCartService,
   clearCartService,
} from "../services/cart.service.js";

// ------ ADD TO CART

const addToCart = asyncHandler(async (req, res) => {
   const { productId, quantity } = req.body;

   if (!productId || !quantity) {
      throw new ApiError(400, "productId and quantity required");
   }

   const cart = await addToCartService(
      req.user._id,
      productId,
      Number(quantity),
   );

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

// ------ UPDATE ITEM

const updateCartItem = asyncHandler(async (req, res) => {
   const { productId, quantity } = req.body;

   if (!productId) {
      throw new ApiError(400, "productId is required");
   }

   const cart = await updateCartItemService(
      req.user._id,
      productId,
      Number(quantity),
   );

   return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

// ------ REMOVE ITEM

const removeFromCart = asyncHandler(async (req, res) => {
   const { productId } = req.body;

   if (!productId) {
      throw new ApiError(400, "productId is required");
   }

   const cart = await removeFromCartService(req.user._id, productId);

   return res
      .status(200)
      .json(new ApiResponse(200, cart, "Item removed from cart"));
});

// ------ CLEAR CART

const clearCart = asyncHandler(async (req, res) => {
   const cart = await clearCartService(req.user._id);

   return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

// ------ EXPORTING CONTROLLERS

export { addToCart, getCart, updateCartItem, removeFromCart, clearCart };
