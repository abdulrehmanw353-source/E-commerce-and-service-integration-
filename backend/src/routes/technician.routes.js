import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { uploadImage } from "../config/multer.js";
import {
   createTechnician,
   getAllTechnicians,
   getSingleTechnician,
   updateTechnician,
   deleteTechnician,
   getPublicAvailableTechnicians,
} from "../controllers/technician.controller.js";

const router = Router();

router.get("/available", getPublicAvailableTechnicians);
router.post(
   "/",
   verifyJWT,
   authorizeRoles("admin"),
   uploadImage("cnicImage"),
   createTechnician,
);
router.get("/", verifyJWT, authorizeRoles("admin"), getAllTechnicians);
router.get("/:id", verifyJWT, authorizeRoles("admin"), getSingleTechnician);
router.patch(
   "/:id",
   verifyJWT,
   authorizeRoles("admin"),
   uploadImage("cnicImage"),
   updateTechnician,
);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteTechnician);

export default router;
