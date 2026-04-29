import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import {
   createBooking,
   getCustomerBookings,
   getSingleBooking,
   cancelBooking,
} from "../controllers/booking.controller.js";

// ------ CREATE BOOKING

router.post("/", verifyJWT, createBooking);

// ------ GET CUSTOMER BOOKINGS

router.get("/", verifyJWT, getCustomerBookings);

// ------ GET SINGLE BOOKING

router.get("/:id", verifyJWT, getSingleBooking);

// ------ CANCEL BOOKING

router.patch("/:id/cancel", verifyJWT, cancelBooking);

// ------ EXPORTING ROUTER

export default router;
