import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// ------ GET PUBLIC PRODUCTS

const getPublicProductsService = async (query) => {
   const {
      keyword,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort,
   } = query;

   // ------ FILTER OBJECT
   const filter = { isDeleted: false };

   // ------ TEXT SEARCH
   if (keyword) {
      filter.$text = { $search: keyword };
   }

   // ------ CATEGORY FILTER
   if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
   }

   // ------ PRICE FILTER
   if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
   }

   // ------ PAGINATION
   const pageNumber = Math.max(1, Number(page));
   const limitNumber = Math.min(100, Math.max(1, Number(limit)));
   const skip = (pageNumber - 1) * limitNumber;

   // ------ SORTING
   let sortOption = { createdAt: -1 };

   const allowedSortFields = ["price", "createdAt", "ratings"];

   if (keyword) {
      // prioritize text relevance
      sortOption = { score: { $meta: "textScore" } };
   } else if (sort && allowedSortFields.includes(sort.replace("-", ""))) {
      const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith("-") ? -1 : 1;

      sortOption = { [sortField]: sortOrder };
   }

   // ------ QUERY EXECUTION
   let queryBuilder = Product.find(filter).skip(skip).limit(limitNumber);

   // ------ APPLY TEXT SCORE
   if (keyword) {
      queryBuilder = queryBuilder
         .select({
            title: 1,
            price: 1,
            images: 1,
            category: 1,
            ratings: 1,
            numReviews: 1,
            score: { $meta: "textScore" },
         })
         .sort(sortOption);
   } else {
      queryBuilder = queryBuilder
         .select("title price images category ratings numReviews")
         .sort(sortOption);
   }

   const products = await queryBuilder;

   // ------ TOTAL COUNT
   const totalProducts = await Product.countDocuments(filter);

   return {
      products,
      totalProducts,
      page: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
   };
};

// ------ GET SINGLE PRODUCT

const getPublicSingleProductService = async (id) => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
   }

   const product = await Product.findOne({
      _id: id,
      isDeleted: false,
   });

   if (!product) {
      throw new ApiError(404, "Product not found");
   }

   return product;
};

// ------ EXPORTING SERVICES

export { getPublicProductsService, getPublicSingleProductService };
