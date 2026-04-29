import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
   createTimeSlot,
   getAvailableSlots,
   getAllSlots,
   updateSlot,
   deleteSlot,
} from "../controllers/timeSlot.controller.js";

// ------ PUBLIC: GET AVAILABLE SLOTS

router.get("/available", getAvailableSlots);

// ------ ADMIN: CREATE SLOT

router.post("/", verifyJWT, authorizeRoles("admin"), createTimeSlot);

// ------ ADMIN: GET ALL SLOTS

router.get("/", verifyJWT, authorizeRoles("admin"), getAllSlots);

// ------ ADMIN: UPDATE SLOT

router.patch("/:id", verifyJWT, authorizeRoles("admin"), updateSlot);

// ------ ADMIN: DELETE SLOT

router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteSlot);

// ------ EXPORTING ROUTER

export default router;
