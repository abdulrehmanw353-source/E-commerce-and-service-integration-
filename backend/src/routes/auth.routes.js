import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import {
   registerCustomer,
   loginCustomer,
   refreshAccessToken,
   logoutCustomer,
   loginAdmin,
   logoutAdmin,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

// ------ CUSTOMER ROUTES

router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);
router.post("/customer/refresh-token", refreshAccessToken);
router.post("/customer/logout", verifyJWT, logoutCustomer);

// ------ ADMIN ROUTES

router.post("/admin/login", loginAdmin);
router.post("/admin/refresh-token", refreshAccessToken);
router.post("/admin/logout", verifyJWT, logoutAdmin);

// ------ EXPORTING ROUTER

export default router;
