import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Booking from "../models/booking.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinary.upload.js";
import TimeSlot from "../models/timeSlot.model.js";
import Technician from "../models/technician.model.js";
import {
   ACTIVE_BOOKING_STATUSES,
   recomputeTechnicianLoad,
} from "./technician.service.js";

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
   if (!payload.technicianId) {
      throw new ApiError(400, "Technician selection is required");
   }
   if (!payload.preferredTimeSlot) {
      throw new ApiError(400, "Preferred time slot is required");
   }

   // ------ validate preferred date is in the future
   const preferredDate = new Date(payload.preferredDate);

   if (preferredDate <= new Date()) {
      throw new ApiError(400, "Preferred date must be in the future");
   }

   const technician = await Technician.findById(payload.technicianId);
   if (!technician) throw new ApiError(404, "Technician not found");
   if (!technician.isAvailable || technician.status === "unavailable") {
      throw new ApiError(400, "Selected technician is unavailable");
   }

   const slot = await TimeSlot.findById(payload.preferredTimeSlot);
   if (!slot) throw new ApiError(404, "Time slot not found");
   if (!slot.isAvailable || slot.currentBookings >= slot.maxBookings) {
      throw new ApiError(400, "Selected time slot is unavailable");
   }

   const existingTechnicianBooking = await Booking.findOne({
      technician: payload.technicianId,
      preferredDate,
      preferredTimeSlot: payload.preferredTimeSlot,
      status: { $in: ACTIVE_BOOKING_STATUSES },
   });
   if (existingTechnicianBooking) {
      throw new ApiError(
         409,
         "Selected slot is already booked for this technician",
      );
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
      preferredTimeSlot: payload.preferredTimeSlot,
      technician: payload.technicianId,
      assignedTechnician: `${technician.firstName} ${technician.lastName || ""}`.trim(),
      status: "pending",
      ...(payload.location ? { location: payload.location } : {}),
   });

   slot.currentBookings += 1;
   await slot.save({ validateBeforeSave: false });
   await recomputeTechnicianLoad(payload.technicianId);

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
   if (booking.preferredTimeSlot) {
      await TimeSlot.findByIdAndUpdate(booking.preferredTimeSlot, {
         $inc: { currentBookings: -1 },
      });
   }
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
