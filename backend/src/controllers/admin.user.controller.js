// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
   getAllUsersService,
   getSingleUserService,
   updateUserRoleService,
} from "../services/admin.user.service.js";

// ------ GET ALL USERS (ADMIN)

const getAllUsers = asyncHandler(async (req, res) => {
   const result = await getAllUsersService(req.query);

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Users fetched successfully"));
});

// ------ GET SINGLE USER (ADMIN)

const getSingleUser = asyncHandler(async (req, res) => {
   const user = await getSingleUserService(req.params.id);

   return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
});

// ------ UPDATE USER ROLE (ADMIN)

const updateUserRole = asyncHandler(async (req, res) => {
   const { role } = req.body;

   if (!role) {
      throw new ApiError(400, "Role is required");
   }

   const user = await updateUserRoleService(req.params.id, role);

   return res
      .status(200)
      .json(new ApiResponse(200, user, "User role updated successfully"));
});

// ------ EXPORTING CONTROLLERS

export { getAllUsers, getSingleUser, updateUserRole };
