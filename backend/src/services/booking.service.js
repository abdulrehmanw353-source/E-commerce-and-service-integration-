import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Booking from "../models/booking.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinary.upload.js";

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

   // ------ validate preferred date is in the future
   const preferredDate = new Date(payload.preferredDate);

   if (preferredDate <= new Date()) {
      throw new ApiError(400, "Preferred date must be in the future");
   }

   // ------ upload images to Cloudinary (if provided)
   let imageUrls = [];

   if (files && files.length > 0) {
      imageUrls = await uploadMultipleToCloudinary(files, "bookings");
   }

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
      preferredTimeSlot: payload.preferredTimeSlot || undefined,
      status: "pending",
   });

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
   });

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

   return booking;
};

// ------ EXPORTING SERVICES

export {
   createBookingService,
   getCustomerBookingsService,
   getSingleBookingService,
   cancelBookingService,
};
