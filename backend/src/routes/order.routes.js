import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import {
   createOrder,
   createGuestOrder,
   getUserOrders,
   getSingleOrder,
} from "../controllers/order.controller.js";

// ------ CREATE ORDER (CHECKOUT)

router.post("/create", verifyJWT, createOrder);

// ------ GUEST CHECKOUT (NO AUTH)

router.post("/guest", createGuestOrder);

// ------ GET USER ORDERS

router.get("/", verifyJWT, getUserOrders);

// ------ GET SINGLE ORDER

router.get("/:id", verifyJWT, getSingleOrder);

// ------ EXPORTING ROUTER

export default router;
