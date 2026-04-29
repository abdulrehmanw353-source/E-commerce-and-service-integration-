import { Router } from "express";

// ------ SETUP ROUTER

const router = Router();

// ------ IMPORTING FROM FILES

import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
   getDashboardStats,
   getRecentOrders,
   getRecentCustomers,
   getRecentReviews,
   getRevenueAnalytics,
   getOrderAnalytics,
   getProductPerformance,
   getCategoryDistribution,
} from "../controllers/admin.dashboard.controller.js";

// ====== STATS ======

router.get("/stats", verifyJWT, authorizeRoles("admin"), getDashboardStats);

// ====== ACTIVITY ======

router.get(
   "/recent-orders",
   verifyJWT,
   authorizeRoles("admin"),
   getRecentOrders,
);

router.get(
   "/recent-customers",
   verifyJWT,
   authorizeRoles("admin"),
   getRecentCustomers,
);

router.get(
   "/recent-reviews",
   verifyJWT,
   authorizeRoles("admin"),
   getRecentReviews,
);

// ====== ANALYTICS ======

router.get(
   "/analytics/revenue",
   verifyJWT,
   authorizeRoles("admin"),
   getRevenueAnalytics,
);

router.get(
   "/analytics/orders",
   verifyJWT,
   authorizeRoles("admin"),
   getOrderAnalytics,
);

router.get(
   "/analytics/products",
   verifyJWT,
   authorizeRoles("admin"),
   getProductPerformance,
);

router.get(
   "/analytics/categories",
   verifyJWT,
   authorizeRoles("admin"),
   getCategoryDistribution,
);

// ------ EXPORTING ROUTER

export default router;
