import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import {
   getPublicProducts,
   getPublicSingleProduct,
} from "../controllers/public.product.controller.js";

// ------ PUBLIC ROUTES (NO AUTH)

router.get("/", getPublicProducts);
router.get("/:id", getPublicSingleProduct);

// ------ EXPORTING ROUTER

export default router;
