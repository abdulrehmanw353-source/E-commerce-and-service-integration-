// ------ IMPORTING FROM FILES

import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";

// ====== DASHBOARD STATS ======

const getDashboardStatsService = async () => {
   // ------ run all count queries in parallel
   const [
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      ecommerceRevenueResult,
      repairRevenueResult,
   ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Product.countDocuments({ isDeleted: false }),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({ status: "cancelled" }),
      Order.aggregate([
         { $match: { paymentStatus: "paid" } },
         { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Booking.aggregate([
         {
            $group: {
               _id: null,
               total: { $sum: { $add: ["$advancePaidAmount", "$remainingBalance"] } }
            }
         }
      ])
   ]);

   const ecommerceRevenue =
      ecommerceRevenueResult.length > 0 ? ecommerceRevenueResult[0].total : 0;
      
   const repairRevenue =
      repairRevenueResult.length > 0 ? repairRevenueResult[0].total : 0;

   const totalRevenue = ecommerceRevenue + repairRevenue;

   return {
      totalCustomers,
      totalProducts,
      totalOrders,
      ecommerceRevenue,
      repairRevenue,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
   };
};

// ====== DASHBOARD ACTIVITY ======

// ------ RECENT ORDERS

const getRecentOrdersService = async (limit = 10) => {
   const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

   return orders;
};

// ------ RECENT CUSTOMERS

const getRecentCustomersService = async (limit = 10) => {
   const customers = await User.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

   return customers;
};

// ------ RECENT REVIEWS

const getRecentReviewsService = async (limit = 10) => {
   const reviews = await Review.find()
      .populate("user", "firstName lastName")
      .populate("product", "title images")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

   return reviews;
};

// ====== ANALYTICS ======

// ------ REVENUE ANALYTICS (monthly breakdown for last 12 months)

const getRevenueAnalyticsService = async (months = 12) => {
   const startDate = new Date();
   startDate.setMonth(startDate.getMonth() - Number(months));

   const ecommerceRevenue = await Order.aggregate([
      {
         $match: {
            paymentStatus: "paid",
            createdAt: { $gte: startDate },
         },
      },
      {
         $group: {
            _id: {
               year: { $year: "$createdAt" },
               month: { $month: "$createdAt" },
            },
            totalRevenue: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
         },
      },
   ]);

   const repairRevenue = await Booking.aggregate([
      {
         $match: {
            createdAt: { $gte: startDate },
         },
      },
      {
         $group: {
            _id: {
               year: { $year: "$createdAt" },
               month: { $month: "$createdAt" },
            },
            totalRevenue: { $sum: { $add: ["$advancePaidAmount", "$remainingBalance"] } },
            bookingCount: { $sum: 1 },
         },
      },
   ]);

   // Merge the arrays
   const mergedRevenue = {};

   const mergeItem = (item, type) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!mergedRevenue[key]) {
         mergedRevenue[key] = {
            year: item._id.year,
            month: item._id.month,
            ecommerceRevenue: 0,
            repairRevenue: 0,
            totalRevenue: 0,
            orderCount: 0,
            bookingCount: 0,
         };
      }
      
      if (type === "ecommerce") {
         mergedRevenue[key].ecommerceRevenue = item.totalRevenue;
         mergedRevenue[key].orderCount = item.orderCount;
      } else {
         mergedRevenue[key].repairRevenue = item.totalRevenue;
         mergedRevenue[key].bookingCount = item.bookingCount;
      }
      mergedRevenue[key].totalRevenue = mergedRevenue[key].ecommerceRevenue + mergedRevenue[key].repairRevenue;
   };

   ecommerceRevenue.forEach(item => mergeItem(item, "ecommerce"));
   repairRevenue.forEach(item => mergeItem(item, "repair"));

   // Sort by year and month
   const finalRevenue = Object.values(mergedRevenue).sort((a, b) => {
      if (a.year === b.year) return a.month - b.month;
      return a.year - b.year;
   });

   return finalRevenue;
};

// ------ ORDER ANALYTICS (monthly breakdown for last 12 months)

const getOrderAnalyticsService = async (months = 12) => {
   const startDate = new Date();
   startDate.setMonth(startDate.getMonth() - Number(months));

   const orders = await Order.aggregate([
      {
         $match: {
            createdAt: { $gte: startDate },
         },
      },
      {
         $group: {
            _id: {
               year: { $year: "$createdAt" },
               month: { $month: "$createdAt" },
               status: "$status",
            },
            count: { $sum: 1 },
         },
      },
      {
         $group: {
            _id: {
               year: "$_id.year",
               month: "$_id.month",
            },
            statuses: {
               $push: {
                  status: "$_id.status",
                  count: "$count",
               },
            },
            totalOrders: { $sum: "$count" },
         },
      },
      {
         $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
         $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalOrders: 1,
            statuses: 1,
         },
      },
   ]);

   return orders;
};

// ------ PRODUCT PERFORMANCE (top products by revenue)

const getProductPerformanceService = async (limit = 10) => {
   const products = await Order.aggregate([
      { $unwind: "$items" },
      {
         $group: {
            _id: "$items.product",
            totalSold: { $sum: "$items.quantity" },
            totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            orderCount: { $sum: 1 },
            productTitle: { $first: "$items.title" },
            productImage: { $first: "$items.image" },
         },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: Number(limit) },
      {
         $project: {
            _id: 0,
            productId: "$_id",
            productTitle: 1,
            productImage: 1,
            totalSold: 1,
            totalRevenue: 1,
            orderCount: 1,
         },
      },
   ]);

   return products;
};

// ------ CATEGORY DISTRIBUTION

const getCategoryDistributionService = async () => {
   const categories = await Product.aggregate([
      { $match: { isDeleted: false } },
      {
         $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
            totalStock: { $sum: "$stock" },
         },
      },
      { $sort: { count: -1 } },
      {
         $project: {
            _id: 0,
            category: "$_id",
            count: 1,
            avgPrice: { $round: ["$avgPrice", 2] },
            totalStock: 1,
         },
      },
   ]);

   return categories;
};

// ------ EXPORTING SERVICES

export {
   getDashboardStatsService,
   getRecentOrdersService,
   getRecentCustomersService,
   getRecentReviewsService,
   getRevenueAnalyticsService,
   getOrderAnalyticsService,
   getProductPerformanceService,
   getCategoryDistributionService,
};
