import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

// ------ GET ALL USERS (ADMIN)

const getAllUsersService = async (query) => {
   // ------ pagination
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
   const skip = (page - 1) * limit;

   // ------ filter object
   const filter = {};

   // ------ filter by role
   const allowedRoles = ["customer", "admin"];

   if (query.role && allowedRoles.includes(query.role)) {
      filter.role = query.role;
   }

   // ------ search by name or email
   if (query.search) {
      const searchRegex = new RegExp(query.search, "i");

      filter.$or = [
         { firstName: searchRegex },
         { lastName: searchRegex },
         { email: searchRegex },
      ];
   }

   // ------ fetching users
   const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

   // ------ counting total users
   const totalUsers = await User.countDocuments(filter);

   return {
      users,
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
   };
};

// ------ GET SINGLE USER (ADMIN)

const getSingleUserService = async (userId) => {
   if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
   }

   const user = await User.findById(userId);

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   return user;
};

// ------ UPDATE USER ROLE (ADMIN)

const updateUserRoleService = async (userId, role) => {
   if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
   }

   const allowedRoles = ["customer", "admin"];

   if (!role || !allowedRoles.includes(role)) {
      throw new ApiError(400, "Invalid role. Allowed: customer, admin");
   }

   const user = await User.findById(userId);

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   user.role = role;
   await user.save({ validateBeforeSave: false });

   return user;
};

// ------ EXPORTING SERVICES

export { getAllUsersService, getSingleUserService, updateUserRoleService };
