import { Router } from "express";
import {
   getPublicServices,
   getPublicServiceBySlug,
} from "../controllers/service.controller.js";

const router = Router();

router.get("/", getPublicServices);
router.get("/:slug", getPublicServiceBySlug);

export default router;

