import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Booking from "../models/booking.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinary.upload.js";

import Technician from "../models/technician.model.js";
import {
   ACTIVE_BOOKING_STATUSES,
   recomputeTechnicianLoad,
} from "./technician.service.js";
import ServiceSettings from "../models/serviceSettings.model.js";

// ------ CREATE BOOKING SERVICE

const createBookingService = async (userId, payload, files) => {
   // ------ validate required fields
   if (!payload.problemTitle || !payload.problemDescription) {
      throw new ApiError(400, "Problem title and description are required");
   }

   if (!payload.deviceType) {
      throw new ApiError(400, "Device type is required");
   }

   if (!payload.preferredDate) {
      throw new ApiError(400, "Preferred date is required");
   }
   if (!payload.preferredTime) {
      throw new ApiError(400, "Preferred time is required");
   }

   // ------ validate preferred date is in the future
   const preferredDate = new Date(payload.preferredDate);

   if (preferredDate <= new Date()) {
      throw new ApiError(400, "Preferred date must be in the future");
   }

   const availableTechs = await Technician.find({ isAvailable: true, status: { $ne: "unavailable" } });
   if (availableTechs.length === 0) throw new ApiError(400, "No technicians are currently operating");

   // ------ validate service area
   if (payload.location) {
      const { address, city, state, country } = payload.location;
      const serviceSettings = await ServiceSettings.getSettings();
      
      if (!serviceSettings.isServiceActive) {
         throw new ApiError(400, "Service is currently inactive.");
      }

      const isMatch = (allowedList, value1, value2) => {
         if (!allowedList || allowedList.length === 0) return true;
         const str1 = (value1 || "").toLowerCase();
         const str2 = (value2 || "").toLowerCase();
         return allowedList.some((allowed) => {
            const allowedLower = allowed.toLowerCase();
            return str1.includes(allowedLower) || str2.includes(allowedLower);
         });
      };

      if (
         !isMatch(serviceSettings.allowedCities, city, address) ||
         !isMatch(serviceSettings.allowedStates, state, address) ||
         !isMatch(serviceSettings.allowedCountries, country, address)
      ) {
         throw new ApiError(
            400,
            `Service is not available in your area. Currently serving: ${serviceSettings.allowedCities.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")}.`
         );
      }
   } else {
      throw new ApiError(400, "Location details are required to book a service.");
   }

   const startOfDay = new Date(preferredDate);
   startOfDay.setHours(0, 0, 0, 0);
   const endOfDay = new Date(preferredDate);
   endOfDay.setHours(23, 59, 59, 999);

   const bookedTechIds = await Booking.find({
      preferredDate: { $gte: startOfDay, $lte: endOfDay },
      preferredTime: payload.preferredTime,
      status: { $in: ACTIVE_BOOKING_STATUSES },
   }).distinct("technician");

   const assignedTech = availableTechs.find(t => !bookedTechIds.some(id => id.toString() === t._id.toString()));
   if (!assignedTech) {
      throw new ApiError(400, "No technicians available for this time slot. Please choose another time.");
   }

   // ------ upload images to Cloudinary (if provided)
   let imageUrls = [];

   if (files && files.length > 0) {
      imageUrls = await uploadMultipleToCloudinary(files, "bookings");
   }

   // ------ get payment rule
   const serviceSettings = await ServiceSettings.getSettings();
   const paymentModeRule = serviceSettings.defaultPaymentModeRule || "pay_after_service_completion";

   // ------ create booking
   const booking = await Booking.create({
      customer: userId,
      problemTitle: payload.problemTitle,
      problemDescription: payload.problemDescription,
      deviceType: payload.deviceType,
      deviceBrand: payload.deviceBrand,
      deviceModel: payload.deviceModel,
      images: imageUrls,
      preferredDate,
      preferredTime: payload.preferredTime,
      technician: assignedTech._id,
      assignedTechnician: `${assignedTech.firstName} ${assignedTech.lastName || ""}`.trim(),
      status: "pending",
      paymentModeRule,
      paymentMethod: payload.paymentMethod || "cod",
      ...(payload.location ? { location: payload.location } : {}),
   });

   await recomputeTechnicianLoad(assignedTech._id);

   return booking;
};

// ------ GET CUSTOMER BOOKINGS SERVICE

const getCustomerBookingsService = async (userId, query) => {
   // ------ pagination
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
   const skip = (page - 1) * limit;

   // ------ filter
   const filter = { customer: userId };

   // ------ filter by status
   const allowedStatus = [
      "pending",
      "approved",
      "in-progress",
      "completed",
      "rejected",
      "cancelled",
   ];

   if (query.status && allowedStatus.includes(query.status)) {
      filter.status = query.status;
   }

   // ------ fetching bookings
   const bookings = await Booking.find(filter)
      .populate("technician", "firstName lastName status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

   // ------ counting total bookings
   const totalBookings = await Booking.countDocuments(filter);

   return {
      bookings,
      totalBookings,
      page,
      totalPages: Math.ceil(totalBookings / limit),
   };
};

// ------ GET SINGLE BOOKING SERVICE

const getSingleBookingService = async (bookingId, userId) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   // ------ scoped to customer (only see own bookings)
   const booking = await Booking.findOne({
      _id: bookingId,
      customer: userId,
   }).populate("technician", "firstName lastName status expertise");

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   return booking;
};

// ------ CANCEL BOOKING SERVICE

const cancelBookingService = async (bookingId, userId) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   const booking = await Booking.findOne({
      _id: bookingId,
      customer: userId,
   });

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   // ------ only pending bookings can be cancelled by customer
   if (booking.status !== "pending") {
      throw new ApiError(
         400,
         "Only pending bookings can be cancelled",
      );
   }

   booking.status = "cancelled";
   await booking.save();
   await recomputeTechnicianLoad(booking.technician);

   return booking;
};

// ------ EXPORTING SERVICES

export {
   createBookingService,
   getCustomerBookingsService,
   getSingleBookingService,
   cancelBookingService,
};
