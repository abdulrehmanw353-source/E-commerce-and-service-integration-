import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// ------ GET PUBLIC PRODUCTS

const getPublicProductsService = async (query) => {
   // ------ defining what page and how many limit
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

   // ------ skip (products calculations) for next pages
   const skip = (page - 1) * limit;

   // ------ fetching limited products
   const products = await Product.find({ isDeleted: false, stock: { $gt: 0 } })
      .select("title price images category ratings numReviews")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

   // ------ counting the total products stored in DB
   const totalProducts = await Product.countDocuments({ isDeleted: false });

   // ------ returning data
   return {
      products,
      totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
   };
};

// ------ GET SINGLE PRODUCT

const getPublicSingleProductService = async (id) => {
   // ------ validate mongodb id
   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
   }

   // ------ find product
   const product = await Product.findOne({
      _id: id,
      isDeleted: false,
   });

   // ------ not found check
   if (!product) {
      throw new ApiError(404, "Product not found");
   }

   // ------ returning product data
   return product;
};

// ------ EXPORTING SERVICES

export { getPublicProductsService, getPublicSingleProductService };
