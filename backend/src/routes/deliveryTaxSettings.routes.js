import { Router } from "express";
import {
   getDeliveryTaxSettings,
   updateDeliveryTaxSettings,
} from "../controllers/deliveryTaxSettings.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

// Public route for storefront
router.get("/", getDeliveryTaxSettings);

// Protected admin route
router.put("/", verifyJWT, authorizeRoles("admin"), updateDeliveryTaxSettings);

export default router;
