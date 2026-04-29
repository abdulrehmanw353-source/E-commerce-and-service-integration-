import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Booking from "../models/booking.model.js";
import ApiError from "../utils/ApiError.js";

// ------ GET ALL BOOKINGS (ADMIN)

const getAllBookingsService = async (query) => {
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
   const skip = (page - 1) * limit;

   const filter = {};

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

   const bookings = await Booking.find(filter)
      .populate("customer", "firstName lastName email phoneNo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

   const totalBookings = await Booking.countDocuments(filter);

   return {
      bookings,
      totalBookings,
      page,
      totalPages: Math.ceil(totalBookings / limit),
   };
};

// ------ GET SINGLE BOOKING (ADMIN)

const getAdminSingleBookingService = async (bookingId) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   const booking = await Booking.findById(bookingId)
      .populate("customer", "firstName lastName email phoneNo address")
      .populate("preferredTimeSlot");

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   return booking;
};

// ------ APPROVE BOOKING (ADMIN)

const approveBookingService = async (bookingId, adminNotes, estimatedCost) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   const booking = await Booking.findById(bookingId);

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   if (booking.status !== "pending") {
      throw new ApiError(400, "Only pending bookings can be approved");
   }

   booking.status = "approved";

   if (adminNotes) booking.adminNotes = adminNotes;
   if (estimatedCost) booking.estimatedCost = estimatedCost;

   await booking.save();

   return booking;
};

// ------ REJECT BOOKING (ADMIN)

const rejectBookingService = async (bookingId, rejectionReason) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   const booking = await Booking.findById(bookingId);

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   if (booking.status !== "pending") {
      throw new ApiError(400, "Only pending bookings can be rejected");
   }

   booking.status = "rejected";

   if (rejectionReason) booking.rejectionReason = rejectionReason;

   await booking.save();

   return booking;
};

// ------ ASSIGN TECHNICIAN (ADMIN)

const assignTechnicianService = async (bookingId, technicianName) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   if (!technicianName) {
      throw new ApiError(400, "Technician name is required");
   }

   const booking = await Booking.findById(bookingId);

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   if (booking.status === "cancelled" || booking.status === "rejected") {
      throw new ApiError(400, "Cannot assign technician to cancelled or rejected booking");
   }

   booking.assignedTechnician = technicianName;

   await booking.save();

   return booking;
};

// ------ UPDATE BOOKING STATUS (ADMIN)

const updateBookingStatusService = async (bookingId, status, finalCost) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   const allowedStatus = [
      "pending",
      "approved",
      "in-progress",
      "completed",
      "rejected",
      "cancelled",
   ];

   if (!status || !allowedStatus.includes(status)) {
      throw new ApiError(400, "Invalid booking status");
   }

   const booking = await Booking.findById(bookingId);

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   booking.status = status;

   if (finalCost !== undefined) booking.finalCost = finalCost;

   await booking.save();

   return booking;
};

// ------ EXPORTING SERVICES

export {
   getAllBookingsService,
   getAdminSingleBookingService,
   approveBookingService,
   rejectBookingService,
   assignTechnicianService,
   updateBookingStatusService,
};
