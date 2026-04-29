// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
   getProfileService,
   updateProfileService,
   changePasswordService,
} from "../services/customer.service.js";

// ------ GET PROFILE

const getProfile = asyncHandler(async (req, res) => {
   const user = await getProfileService(req.user._id);

   return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

// ------ UPDATE PROFILE

const updateProfile = asyncHandler(async (req, res) => {
   const user = await updateProfileService(req.user._id, req.body);

   return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile updated successfully"));
});

// ------ CHANGE PASSWORD

const changePassword = asyncHandler(async (req, res) => {
   const { currentPassword, newPassword } = req.body;

   if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current password and new password are required");
   }

   await changePasswordService(req.user._id, currentPassword, newPassword);

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ------ EXPORTING CONTROLLERS

export { getProfile, updateProfile, changePassword };
