import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { uploadImages } from "../config/multer.js";
import {
   createProduct,
   getAllProducts,
   getSingleProduct,
   updateProduct,
   deleteProduct,
} from "../controllers/product.controller.js";

// ------ PRODUCT ROUTES

router.post(
   "/create",
   verifyJWT,
   authorizeRoles("admin"),
   uploadImages("images", 10),
   createProduct,
);
router.get("/", verifyJWT, authorizeRoles("admin"), getAllProducts);
router.get("/:id", verifyJWT, authorizeRoles("admin"), getSingleProduct);
router.patch(
   "/:id",
   verifyJWT,
   authorizeRoles("admin"),
   uploadImages("images", 10),
   updateProduct,
);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteProduct);

// ------ EXPORTING ROUTER

export default router;
