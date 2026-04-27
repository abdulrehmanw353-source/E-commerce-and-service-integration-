import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import {
   createReviewService,
   getProductReviewsService,
} from "../services/review.service.js";

// ------ CREATE REVIEW

const createReview = asyncHandler(async (req, res) => {
   const { productId, rating, comment } = req.body;

   if (!productId || rating === undefined) {
      throw new ApiError(400, "productId and rating are required");
   }

   const numericRating = Number(rating);

   if (numericRating < 1 || numericRating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
   }

   const review = await createReviewService(
      req.user._id,
      productId,
      numericRating,
      comment,
   );

   return res
      .status(201)
      .json(new ApiResponse(201, review, "Review created successfully"));
});

// ------ GET REVIEWS

const getProductReviews = asyncHandler(async (req, res) => {
   const reviews = await getProductReviewsService(req.params.productId);

   return res
      .status(200)
      .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// ------ EXPORTING CONTROLLERS

export { createReview, getProductReviews };
