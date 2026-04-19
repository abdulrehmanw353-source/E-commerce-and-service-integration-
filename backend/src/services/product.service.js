// ------ IMPORTING FROM FILES

import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// ------ CREATE & SAVE PRODUCT IN DB

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

// ------ EXPORTING SERVICE

export default createProductService;
