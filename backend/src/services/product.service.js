import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// ------ CREATE & SAVE PRODUCT IN DB (ADMIN)

const createProductService = async (payload, userId) => {
   // ------ optional: basic validation
   if (!payload.title || !payload.price || !payload.stock) {
      throw new ApiError(400, "Missing required product fields");
   }

   // ------ creating & saving product in DB
   const product = await Product.create({
      ...payload,
      createdBy: userId,
   });

   // ------ returning product
   return product;
};

// ------ GET PRODUCTS FROM DB (ADMIN)

const getAllProductsService = async (query) => {
   // ------ defining what page and how many limit
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

   // ------ skip (products calculations) for next pages
   const skip = (page - 1) * limit;

   // ------ fetching limited products
   const products = await Product.find()
      .select("title price stock images category createdBy")
      .populate("createdBy", "firstName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

   // ------ error handling for empty product list
   if (products.length === 0) {
      throw new ApiError(404, "No products found");
   }

   // ------ counting the total products stored in DB
   const totalProducts = await Product.countDocuments();

   // ------ returning data
   return {
      products,
      totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
   };
};

// ------ GET SINGLE PRODUCT BY ID FROM DB (ADMIN)

const getSingleProductService = async (id) => {
   // ------ validate mongodb id
   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
   }

   // ------ find product
   const product = await Product.findById(id).populate(
      "createdBy",
      "firstName email",
   );

   // ------ not found check
   if (!product) {
      throw new ApiError(404, "Product not found");
   }

   // ------ returning product data
   return product;
};

// ------ UPDATE PRODUCT IN DB (ADMIN)

const updateProductService = async (id, payload) => {
   // ------ validate mongodb ID
   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
   }

   // ------ find product
   const product = await Product.findById(id);

   if (!product) {
      throw new ApiError(404, "Product not found");
   }

   // ------ allowed fields only
   const allowedFields = [
      "title",
      "description",
      "price",
      "stock",
      "images",
      "category",
      "brand",
   ];

   // ------ update fields safely
   allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
         product[field] = payload[field];
      }
   });

   // ------ save updated product
   await product.save();

   // ------ returning product data
   return product;
};

// ------ EXPORTING SERVICES

export {
   createProductService,
   getAllProductsService,
   getSingleProductService,
   updateProductService,
};
