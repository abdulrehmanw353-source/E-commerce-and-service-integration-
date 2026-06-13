import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import { normalizeStringArray } from "../utils/formData.js";
import {
   deleteCloudinaryAssets,
   uploadImagesToCloudinary,
} from "./upload.service.js";

// ------ CREATE & SAVE PRODUCT IN DB (ADMIN)

const createProductService = async (payload, userId, files = []) => {
   // ------ optional: basic validation
   if (!payload.title || !payload.price || !payload.stock) {
      throw new ApiError(400, "Missing required product fields");
   }

   // ------ to check product title is unique
   const existingProduct = await Product.findOne({
      title: payload.title,
      isDeleted: false,
   });

   if (existingProduct) {
      throw new ApiError(409, "Product already exist with this name");
   }

   if (!files.length) {
      throw new ApiError(400, "At least one product image is required");
   }

   const uploadedAssets = await uploadImagesToCloudinary(files, "products");

   try {
      const productData = { ...payload };
      delete productData.images;
      delete productData.existingImages;
      return await Product.create({
         ...productData,
         images: uploadedAssets.map((asset) => asset.url),
         createdBy: userId,
      });
   } catch (error) {
      await deleteCloudinaryAssets(uploadedAssets);
      throw error;
   }
};

// ------ GET PRODUCTS FROM DB (ADMIN)

const getAllProductsService = async (query) => {
   // ------ defining what page and how many limit
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

   // ------ skip (products calculations) for next pages
   const skip = (page - 1) * limit;

   // ------ query filter
   const filter = { isDeleted: false };
   if (query.keyword) {
      filter.title = { $regex: query.keyword, $options: "i" };
   }

   // ------ fetching limited products
   const products = await Product.find(filter)
      .select("title price stock images category createdBy")
      .populate("createdBy", "firstName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

   // ------ counting the total products stored in DB
   const totalProducts = await Product.countDocuments(filter);

   // ------ fetching unique categories
   const availableCategories = await Product.distinct("category", { isDeleted: false });

   // ------ returning data
   return {
      products,
      totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      availableCategories,
   };
};

// ------ GET SINGLE PRODUCT BY ID FROM DB (ADMIN)

const getSingleProductService = async (id) => {
   // ------ validate mongodb id
   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
   }

   // ------ find product
   const product = await Product.findOne({
      _id: id,
      isDeleted: false,
   }).populate("createdBy", "firstName email");

   // ------ not found check
   if (!product) {
      throw new ApiError(404, "Product not found");
   }

   // ------ returning product data
   return product;
};

// ------ UPDATE PRODUCT IN DB (ADMIN)

const updateProductService = async (id, payload, files = []) => {
   // ------ validate mongodb ID
   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
   }

   // ------ find product
   const product = await Product.findOne({ _id: id, isDeleted: false });

   if (!product) {
      throw new ApiError(404, "Product not found");
   }

   const isImageUpdate =
      payload.existingImages !== undefined || files.length > 0;
   let retainedImages = product.images;

   if (payload.existingImages !== undefined) {
      const requestedImages = normalizeStringArray(
         payload.existingImages,
         "existingImages",
      );
      const currentImages = new Set(product.images);

      if (requestedImages.some((url) => !currentImages.has(url))) {
         throw new ApiError(400, "Invalid existing product image");
      }

      retainedImages = requestedImages;
   }

   const uploadedAssets = files.length
      ? await uploadImagesToCloudinary(files, "products")
      : [];
   const nextImages = [
      ...retainedImages,
      ...uploadedAssets.map((asset) => asset.url),
   ];

   if (isImageUpdate && nextImages.length === 0) {
      await deleteCloudinaryAssets(uploadedAssets);
      throw new ApiError(400, "At least one product image is required");
   }
   if (nextImages.length > 10) {
      await deleteCloudinaryAssets(uploadedAssets);
      throw new ApiError(400, "A product can have at most 10 images");
   }

   // ------ allowed fields only
   const allowedFields = [
      "title",
      "description",
      "price",
      "stock",
      "category",
      "brand",
   ];

   // ------ update fields safely
   allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
         product[field] = payload[field];
      }
   });

   if (isImageUpdate) {
      product.images = nextImages;
   }

   try {
      await product.save();
   } catch (error) {
      await deleteCloudinaryAssets(uploadedAssets);
      throw error;
   }

   // ------ returning product data
   return product;
};

// ------ DELETE PRODUCT FROM DB (SOFT DELETE)

const deleteProductService = async (id) => {
   // ------ validate mongodb id
   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product ID");
   }

   // ------ find product
   const product = await Product.findOne({ _id: id, isDeleted: false });

   if (!product) {
      throw new ApiError(404, "Product not found");
   }

   // ------ Soft delete
   product.isDeleted = true;

   // ------ saving new changes in DB
   await product.save();

   // ------ returning deleted product
   return product;
};

// ------ EXPORTING SERVICES

export {
   createProductService,
   getAllProductsService,
   getSingleProductService,
   updateProductService,
   deleteProductService,
};
