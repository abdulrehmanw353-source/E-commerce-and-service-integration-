import jwt from "jsonwebtoken";

// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import { ACCESS_TOKEN_SECRET } from "../constants.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

// ------ AUTH PROTECTOR

const verifyJWT = asyncHandler(async (req, res, next) => {
   let token;

   // ------ get token from authorization header
   const authHeader = req.headers.authorization;

   if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
   }

   // ------ if token not found
   if (!token) {
      throw new ApiError(401, "Unauthorized request");
   }

   // ------ verify token
   let decoded;

   try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
   } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
   }

   // ------ find user
   const user = await User.findById(decoded._id);

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   // ------ attach user to request
   req.user = user;

   next();
});

// ------ EXPORTING AUTH PROTECTOR

export default verifyJWT;
