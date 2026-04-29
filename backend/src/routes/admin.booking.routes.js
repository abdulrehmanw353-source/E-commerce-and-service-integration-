import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
   getAllBookings,
   getAdminSingleBooking,
   approveBooking,
   rejectBooking,
   assignTechnician,
   updateBookingStatus,
} from "../controllers/admin.booking.controller.js";

// ------ GET ALL BOOKINGS

router.get("/", verifyJWT, authorizeRoles("admin"), getAllBookings);

// ------ GET SINGLE BOOKING

router.get("/:id", verifyJWT, authorizeRoles("admin"), getAdminSingleBooking);

// ------ APPROVE BOOKING

router.patch("/:id/approve", verifyJWT, authorizeRoles("admin"), approveBooking);

// ------ REJECT BOOKING

router.patch("/:id/reject", verifyJWT, authorizeRoles("admin"), rejectBooking);

// ------ ASSIGN TECHNICIAN

router.patch(
   "/:id/assign",
   verifyJWT,
   authorizeRoles("admin"),
   assignTechnician,
);

// ------ UPDATE BOOKING STATUS

router.patch(
   "/:id/status",
   verifyJWT,
   authorizeRoles("admin"),
   updateBookingStatus,
);

// ------ EXPORTING ROUTER

export default router;
