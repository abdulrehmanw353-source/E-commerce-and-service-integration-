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

// ------ EXPORTING CONTROLLERS

export { registerCustomer };
