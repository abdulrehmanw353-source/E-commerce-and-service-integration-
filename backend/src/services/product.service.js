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

// ------ EXPORTING SERVICES

export { createProductService, getAllProductsService };
