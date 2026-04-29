import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { updateOrderStatus } from "../controllers/order.controller.js";
import {
   getAllOrders,
   getAdminSingleOrder,
} from "../controllers/admin.order.controller.js";

// ------ GET ALL ORDERS (ADMIN)

router.get("/", verifyJWT, authorizeRoles("admin"), getAllOrders);

// ------ GET SINGLE ORDER (ADMIN)

router.get("/:id", verifyJWT, authorizeRoles("admin"), getAdminSingleOrder);

// ------ ADMIN ORDER STATUS UPDATE

router.patch(
   "/:id/status",
   verifyJWT,
   authorizeRoles("admin"),
   updateOrderStatus,
);

// ------ EXPORTING ROUTER

export default router;
