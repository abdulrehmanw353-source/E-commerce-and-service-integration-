import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

// ------ ADD TO CART

router.post("/add", verifyJWT, addToCart);

// ------ GET CART

router.get("/", verifyJWT, getCart);

// ------ EXPORTING ROUTER

export default router;
