import { Schema, model } from "mongoose";

// ------ PRODUCT SCHEMA

const productSchema = new Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
         index: true,
      },
      description: {
         type: String,
         required: true,
         trim: true,
         max: 5000,
      },
      price: {
         type: Number,
         required: true,
         min: 0,
      },
      stock: {
         type: Number,
         required: true,
         min: 0,
      },
      images: [
         {
            type: String,
            required: true,
         },
      ],
      category: {
         type: String,
         required: true,
         trim: true,
      },
      brand: {
         type: String,
         trim: true,
      },
      ratings: {
         type: Number,
         default: 0,
         min: 0,
         max: 5,
      },
      numReviews: {
         type: Number,
         default: 0,
         min: 0,
      },
      createdBy: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      // ------- helps to behave like product is deleted or not
      isDeleted: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   },
);

// ------ ADDING INDEX

productSchema.index({ title: 1, isDeleted: 1 }, { unique: true });
productSchema.index({ title: "text", description: "text" });
productSchema.index({ category: 1 });

// ------ PRODUCT MODEL

const Product = model("Product", productSchema);
export default Product;
