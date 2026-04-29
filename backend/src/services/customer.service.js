import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

// ------ GET PROFILE SERVICE

const getProfileService = async (userId) => {
   const user = await User.findById(userId);

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   return user;
};

// ------ UPDATE PROFILE SERVICE

const updateProfileService = async (userId, payload) => {
   const user = await User.findById(userId);

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   // ------ allowed fields only
   const allowedFields = ["firstName", "lastName", "phoneNo", "address"];

   // ------ update fields safely
   allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
         user[field] = payload[field];
      }
   });

   await user.save({ validateBeforeSave: false });

   return user;
};

// ------ CHANGE PASSWORD SERVICE

const changePasswordService = async (userId, currentPassword, newPassword) => {
   if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current password and new password are required");
   }

   if (newPassword.length < 6) {
      throw new ApiError(400, "New password must be at least 6 characters");
   }

   // ------ find user with password field
   const user = await User.findById(userId).select("+password");

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   // ------ verify current password
   const isPasswordValid = await user.comparePassword(currentPassword);

   if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
   }

   // ------ set new password (will be hashed by pre-save middleware)
   user.password = newPassword;
   await user.save();

   return true;
};

// ------ EXPORTING SERVICES

export { getProfileService, updateProfileService, changePasswordService };
