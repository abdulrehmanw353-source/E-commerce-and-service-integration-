import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING CONTROLLERS

import { registerCustomer } from "../controllers/auth.controller.js";

// ------ CUSTOMER ROUTES

router.post("/customer/register", registerCustomer);

// ------ EXPORTING ROUTER

export default router;
