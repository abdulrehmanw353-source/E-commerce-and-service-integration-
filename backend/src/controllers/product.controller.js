// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   createProductService,
   getAllProductsService,
   getSingleProductService,
   updateProductService,
} from "../services/product.service.js";

// ------ CREATE PRODUCT

const createProduct = asyncHandler(async (req, res) => {
   // ------ sending product data to product service
   const product = await createProductService(req.body, req.user._id);

   // ------ returning response
   return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
});

// ------ GET PRODUCTS

const getAllProducts = asyncHandler(async (req, res) => {
   // ------ getting products data from product service
   const result = await getAllProductsService(req.query);

   // ------ returning response
   return res
      .status(200)
      .json(new ApiResponse(200, result, "Products fetched successfully"));
});

// ------ GET SINGLE PRODUCT

const getSingleProduct = asyncHandler(async (req, res) => {
   // ------ getting single product from product service
   const product = await getSingleProductService(req.params.id);

   // ------ returning response
   return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ------ UPDATE PRODUCT

const updateProduct = asyncHandler(async (req, res) => {
   // ------ updating product using product service
   const product = await updateProductService(req.params.id, req.body);

   // ------ returning response
   return res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
});

// ------ EXPORTING CONTROLLERS

export { createProduct, getAllProducts, getSingleProduct, updateProduct };
