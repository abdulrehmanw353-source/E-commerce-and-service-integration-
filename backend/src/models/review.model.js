import { Schema, model } from "mongoose";

// ------ REVIEW SCHEMA

const reviewSchema = new Schema(
   {
      user: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      product: {
         type: Schema.Types.ObjectId,
         ref: "Product",
         required: true,
      },
      rating: {
         type: Number,
         required: true,
         min: 1,
         max: 5,
      },
      comment: {
         type: String,
         trim: true,
         maxlength: 1000,
      },
   },
   {
      timestamps: true,
   },
);

// ------ PREVENT DUPLICATE REVIEWS

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// ------ REVIEW MODEL

const Review = model("Review", reviewSchema);
export default Review;
