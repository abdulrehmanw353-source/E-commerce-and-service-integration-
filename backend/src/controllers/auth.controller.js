import jwt from "jsonwebtoken";

// ------ EXPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import {
   generateAccessToken,
   generateRefreshToken,
} from "../utils/token.utils.js";
import { NODE_ENV, REFRESH_TOKEN_SECRET } from "../constants.js";

// ------ CUSTOMER REGISTER

const registerCustomer = asyncHandler(async (req, res) => {
   // ------ getting data from request
   const { firstName, lastName, phoneNo, address, email, password } = req.body;

   // ------ checking missing fields that are required
   if (!firstName || !email || !password) {
      throw new ApiError(400, "Required fields are missing");
   }

   // ------ checking user already exists
   const existingUser = await User.findOne({ email });

   if (existingUser) {
      throw new ApiError(400, "Customer (user) already exists");
   }

   // ------ creating and saving user in db
   const user = await User.create({
      firstName,
      lastName,
      phoneNo,
      address,
      email,
      password,
      role: "customer",
   });

   // ------ returning response
   return res
      .status(201)
      .json(
         new ApiResponse(
            201,
            { user: userObj },
            "Customer (user) registered successfully",
         ),
      );
});

// ------ CUSTOMER LOGIN

const loginCustomer = asyncHandler(async (req, res) => {
   // ------ getting data from request
   const { email, password } = req.body;

   // ------ checking missing fields that are required
   if (!email || !password) {
      throw new ApiError(400, "Required fields are missing");
   }

   // ------ checking user already exists
   const user = await User.findOne({ email, role: "customer" }).select(
      "+password",
   );

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   // ------ comparing password
   const isPasswordValid = await user.comparePassword(password);

   if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
   }

   // ------ generating access and refresh tokens
   const refreshToken = generateRefreshToken(user);
   const accessToken = generateAccessToken(user);

   // ------ saving refresh token in DB
   user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false });

   // ------ converting mongoose document into JS object
   const userObj = user.toObject();

   // ------ sending tokens in cookies
   const options = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
   };

   res.cookie("refreshToken", refreshToken, options);

   // ------ returning response
   return res.status(200).json(
      new ApiResponse(
         200,
         {
            user: userObj,
            accessToken: accessToken,
         },
         "User logged-in successfully",
      ),
   );
});

// ------ REFRESH TOKEN TO GENERATE ACCESS TOKEN

const refreshAccessToken = asyncHandler(async (req, res) => {
   // ------ getting refresh token from cookies
   const incomingRefreshToken = req.cookies.refreshToken;

   if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token missing");
   }

   // ------ verifying refresh token
   let decoded;

   try {
      decoded = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
   } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
   }

   // ------ finding user
   const user = await User.findById(decoded._id);

   if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token expired or invalid");
   }

   // ------ generating new refresh & access token
   const newAccessToken = generateAccessToken(user);
   const newRefreshToken = generateRefreshToken(user);

   // ------ updating new refresh token to DB without DB validations
   user.refreshToken = newRefreshToken;
   await user.save({ validateBeforeSave: false });

   // ------ sending tokens in cookies
   const options = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
   };

   res.cookie("refreshToken", newRefreshToken, options);

   // ------ returning response
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { accessToken: newAccessToken },
            "Access token refreshed",
         ),
      );
});

// ------ CUSTOMER LOGOUT

const logoutCustomer = asyncHandler(async (req, res) => {
   // ------ getting user id
   const userId = req.user._id;

   // ------ un-setting user refreshToken
   await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
   });

   // ------ clearing cookies
   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
   });

   // ------ returning response
   return res
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ------ EXPORTING CONTROLLERS

export { registerCustomer, loginCustomer, refreshAccessToken, logoutCustomer };
