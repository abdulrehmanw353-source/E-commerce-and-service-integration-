import jwt from "jsonwebtoken";

// ------ IMPORTING FROM FILES

import {
   ACCESS_TOKEN_SECRET,
   ACCESS_TOKEN_EXPIRY,
   REFRESH_TOKEN_SECRET,
   REFRESH_TOKEN_EXPIRY,
} from "../constants.js";

// ------ GENERATE ACCESS TOKEN

const generateAccessToken = (user) => {
   return jwt.sign(
      {
         _id: user._id,
         email: user.email,
         role: user.role,
      },
      ACCESS_TOKEN_SECRET,
      {
         expiresIn: ACCESS_TOKEN_EXPIRY,
      },
   );
};

// ------ GENERATE REFRESH TOKEN

const generateRefreshToken = (user) => {
   return jwt.sign(
      {
         _id: user._id,
      },
      REFRESH_TOKEN_SECRET,
      {
         expiresIn: REFRESH_TOKEN_EXPIRY,
      },
   );
};

// ------ EXPORING TOKENS GENERATORS

export { generateAccessToken, generateRefreshToken };
