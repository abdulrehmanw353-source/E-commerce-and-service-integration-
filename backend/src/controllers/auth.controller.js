import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

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

   // ------ converting mongoose document into JS object
   const userObj = user.toObject();

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
      throw new ApiError(404, "User didn't exist");
   }

   // ------ comparing password
   const isPasswordValid = await user.comparePassword(password);

   if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect credentials");
   }

   // ------ converting mongoose document into JS object
   const userObj = user.toObject();

   // ------ returning response
   return res
      .status(200)
      .json(
         new ApiResponse(200, { user: userObj }, "User logged-in successfully"),
      );
});

// ------ EXPORTING CONTROLLERS

export { registerCustomer, loginCustomer };
