// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   getDashboardStatsService,
   getRecentOrdersService,
   getRecentCustomersService,
   getRecentReviewsService,
   getRevenueAnalyticsService,
   getOrderAnalyticsService,
   getProductPerformanceService,
   getCategoryDistributionService,
} from "../services/admin.dashboard.service.js";

// ====== DASHBOARD STATS ======

const getDashboardStats = asyncHandler(async (req, res) => {
   const stats = await getDashboardStatsService();

   return res
      .status(200)
      .json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

// ====== DASHBOARD ACTIVITY ======

// ------ RECENT ORDERS

const getRecentOrders = asyncHandler(async (req, res) => {
   const orders = await getRecentOrdersService(req.query.limit);

   return res
      .status(200)
      .json(new ApiResponse(200, orders, "Recent orders fetched successfully"));
});

// ------ RECENT CUSTOMERS

const getRecentCustomers = asyncHandler(async (req, res) => {
   const customers = await getRecentCustomersService(req.query.limit);

   return res
      .status(200)
      .json(
         new ApiResponse(200, customers, "Recent customers fetched successfully"),
      );
});

// ------ RECENT REVIEWS

const getRecentReviews = asyncHandler(async (req, res) => {
   const reviews = await getRecentReviewsService(req.query.limit);

   return res
      .status(200)
      .json(
         new ApiResponse(200, reviews, "Recent reviews fetched successfully"),
      );
});

// ====== ANALYTICS ======

// ------ REVENUE ANALYTICS

const getRevenueAnalytics = asyncHandler(async (req, res) => {
   const revenue = await getRevenueAnalyticsService(req.query.months);

   return res
      .status(200)
      .json(
         new ApiResponse(200, revenue, "Revenue analytics fetched successfully"),
      );
});

// ------ ORDER ANALYTICS

const getOrderAnalytics = asyncHandler(async (req, res) => {
   const orders = await getOrderAnalyticsService(req.query.months);

   return res
      .status(200)
      .json(
         new ApiResponse(200, orders, "Order analytics fetched successfully"),
      );
});

// ------ PRODUCT PERFORMANCE

const getProductPerformance = asyncHandler(async (req, res) => {
   const products = await getProductPerformanceService(req.query.limit);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            products,
            "Product performance fetched successfully",
         ),
      );
});

// ------ CATEGORY DISTRIBUTION

const getCategoryDistribution = asyncHandler(async (req, res) => {
   const categories = await getCategoryDistributionService();

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            categories,
            "Category distribution fetched successfully",
         ),
      );
});

// ------ EXPORTING CONTROLLERS

export {
   getDashboardStats,
   getRecentOrders,
   getRecentCustomers,
   getRecentReviews,
   getRevenueAnalytics,
   getOrderAnalytics,
   getProductPerformance,
   getCategoryDistribution,
};
