import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { createProduct } from "../controllers/product.controller.js";

// ------ PRODUCT ROUTES

router.post("/", verifyJWT, authorizeRoles("admin"), createProduct);

// ------ EXPORTING ROUTER

export default router;
