import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import {
   getProfile,
   updateProfile,
   changePassword,
} from "../controllers/customer.controller.js";

// ------ GET PROFILE

router.get("/profile", verifyJWT, getProfile);

// ------ UPDATE PROFILE

router.patch("/profile", verifyJWT, updateProfile);

// ------ CHANGE PASSWORD

router.patch("/change-password", verifyJWT, changePassword);

// ------ EXPORTING ROUTER

export default router;
