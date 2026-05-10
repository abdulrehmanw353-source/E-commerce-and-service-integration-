import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
   createService,
   getAdminServices,
   getAdminSingleService,
   updateService,
   deleteService,
} from "../controllers/service.controller.js";

const router = Router();

router.post("/", verifyJWT, authorizeRoles("admin"), createService);
router.get("/", verifyJWT, authorizeRoles("admin"), getAdminServices);
router.get("/:id", verifyJWT, authorizeRoles("admin"), getAdminSingleService);
router.patch("/:id", verifyJWT, authorizeRoles("admin"), updateService);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteService);

export default router;

