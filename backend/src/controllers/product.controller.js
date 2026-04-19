// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import createProductService from "../services/product.service.js";

// ------ CREATE PRODUCT

const createProduct = asyncHandler(async (req, res) => {
   // ------ sending product data to product creating service
   const product = await createProductService(req.body, req.user._id);

   // ------ returning response
   return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
});

// ------ EXPORTING CONTROLLERS

export { createProduct };
