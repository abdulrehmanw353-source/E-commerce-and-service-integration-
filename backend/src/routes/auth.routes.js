import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING CONTROLLERS

import {
   registerCustomer,
   loginCustomer,
} from "../controllers/auth.controller.js";

// ------ CUSTOMER ROUTES

router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);

// ------ EXPORTING ROUTER

export default router;
