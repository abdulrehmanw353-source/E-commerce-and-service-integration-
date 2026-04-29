import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
   getAllUsers,
   getSingleUser,
   updateUserRole,
} from "../controllers/admin.user.controller.js";

// ------ GET ALL USERS

router.get("/", verifyJWT, authorizeRoles("admin"), getAllUsers);

// ------ GET SINGLE USER

router.get("/:id", verifyJWT, authorizeRoles("admin"), getSingleUser);

// ------ UPDATE USER ROLE

router.patch("/:id/role", verifyJWT, authorizeRoles("admin"), updateUserRole);

// ------ EXPORTING ROUTER

export default router;
