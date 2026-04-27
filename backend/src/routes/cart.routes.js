import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import {
   addToCart,
   getCart,
   updateCartItem,
   removeFromCart,
   clearCart,
} from "../controllers/cart.controller.js";

// ------ ADD TO CART

router.post("/add", verifyJWT, addToCart);

// ------ GET CART

router.get("/", verifyJWT, getCart);

// ------ UPDATE CART ITEM

router.patch("/update", verifyJWT, updateCartItem);

// ------ REMOVE FROM CART

router.delete("/remove", verifyJWT, removeFromCart);

// ------ CLEAR CART

router.delete("/clear", verifyJWT, clearCart);

// ------ EXPORTING ROUTER

export default router;
