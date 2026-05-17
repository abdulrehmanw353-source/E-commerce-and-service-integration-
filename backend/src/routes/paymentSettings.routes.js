import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
   getPaymentSettings,
   updatePaymentSettings,
} from "../controllers/paymentSettings.controller.js";

// ------ PUBLIC ROUTE (no auth — checkout needs this)

router.get("/", getPaymentSettings);

// ------ ADMIN ROUTE

router.put("/", verifyJWT, authorizeRoles("admin"), updatePaymentSettings);

// ------ EXPORTING ROUTER

export default router;
