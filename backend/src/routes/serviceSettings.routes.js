import { Router } from "express";
import {
   getServiceSettings,
   updateServiceSettings,
} from "../controllers/serviceSettings.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

// Public/Admin route to get settings (Admin needs it, also public users need it to know restrictions)
router.get("/", getServiceSettings);

// Admin route to update settings
router.put("/", verifyJWT, authorizeRoles("admin"), updateServiceSettings);

export default router;
