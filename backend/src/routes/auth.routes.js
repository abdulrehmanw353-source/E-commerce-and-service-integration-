import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING CONTROLLERS

import {
   registerCustomer,
   loginCustomer,
   refreshAccessToken,
   logoutCustomer,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

// ------ CUSTOMER ROUTES

router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);
router.post("/customer/refresh-token", refreshAccessToken);
router.post("/customer/logout", verifyJWT, logoutCustomer);

// ------ EXPORTING ROUTER

export default router;
