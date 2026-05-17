import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import {
   registerCustomer,
   registerAdmin,
   getAdminRegisterStatus,
   loginCustomer,
   refreshAccessToken,
   logoutCustomer,
   loginAdmin,
   logoutAdmin,
   googleLogin,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

// ------ CUSTOMER ROUTES

router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);
router.post("/customer/refresh-token", refreshAccessToken);
router.post("/customer/logout", verifyJWT, logoutCustomer);
router.post("/customer/google", googleLogin);

// ------ ADMIN ROUTES

router.post("/admin/register", registerAdmin);
router.get("/admin/register-status", getAdminRegisterStatus);
router.post("/admin/login", loginAdmin);
router.post("/admin/refresh-token", refreshAccessToken);
router.post("/admin/logout", verifyJWT, logoutAdmin);
router.post("/admin/google", googleLogin);

// ------ EXPORTING ROUTER

export default router;
