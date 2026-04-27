import mongoose from "mongoose";

import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// ------ CREATE REVIEW

const createReviewService = async (userId, productId, rating, comment) => {
   if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
   }

   const product = await Product.findById(productId);

   if (!product || product.isDeleted) {
      throw new ApiError(404, "Product not found");
   }

   let review;

   try {
      review = await Review.create({
         user: userId,
         product: productId,
         rating,
         comment,
      });
   } catch (err) {
      if (err.code === 11000) {
         throw new ApiError(409, "You already reviewed this product");
      }
      throw err;
   }

   await updateProductRating(productId);

   return review;
};

// ------ GET PRODUCT REVIEWS

const getProductReviewsService = async (productId) => {
   if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
   }

   return await Review.find({ product: productId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });
};

// ------ UPDATE RATING

const updateProductRating = async (productId) => {
   const result = await Review.aggregate([
      {
         $match: { product: new mongoose.Types.ObjectId(productId) },
      },
      {
         $group: {
            _id: "$product",
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
         },
      },
   ]);

   if (result.length > 0) {
      await Product.findByIdAndUpdate(productId, {
         ratings: result[0].avgRating,
         numReviews: result[0].totalReviews,
      });
   } else {
      await Product.findByIdAndUpdate(productId, {
         ratings: 0,
         numReviews: 0,
      });
   }
};

// ------ EXPORTING SERVICES

export { createReviewService, getProductReviewsService };
