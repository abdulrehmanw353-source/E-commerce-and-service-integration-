// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   getPublicProductsService,
   getPublicSingleProductService,
} from "../services/public.product.service.js";

// ------ GET PUBLIC PRODUCTS

const getPublicProducts = asyncHandler(async (req, res) => {
   // ------ getting products data from product service
   const result = await getPublicProductsService(req.query);

   // ------ returning response
   return res
      .status(200)
      .json(new ApiResponse(200, result, "Product fetched successfully"));
});

// ------ GET PUBLIC SINGLE PRODUCT

const getPublicSingleProduct = asyncHandler(async (req, res) => {
   // ------ getting single product from product service
   const product = await getPublicSingleProductService(req.params.id);

   // ------ returning response
   return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ------ EXPORTING CONTROLLERS

export { getPublicProducts, getPublicSingleProduct };
