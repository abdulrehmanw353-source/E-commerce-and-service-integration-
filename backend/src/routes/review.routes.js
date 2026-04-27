import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import {
   createReview,
   getProductReviews,
} from "../controllers/review.controller.js";

// ------ CREATE REVIEW

router.post("/", verifyJWT, createReview);

// ------ GET REVIEWS FOR PRODUCT

router.get("/:productId", getProductReviews);

// ------ EXPORTING ROUTER

export default router;
