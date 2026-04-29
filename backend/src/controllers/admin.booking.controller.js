// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
   getAllBookingsService,
   getAdminSingleBookingService,
   approveBookingService,
   rejectBookingService,
   assignTechnicianService,
   updateBookingStatusService,
} from "../services/admin.booking.service.js";

// ------ GET ALL BOOKINGS (ADMIN)

const getAllBookings = asyncHandler(async (req, res) => {
   const result = await getAllBookingsService(req.query);

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Bookings fetched successfully"));
});

// ------ GET SINGLE BOOKING (ADMIN)

const getAdminSingleBooking = asyncHandler(async (req, res) => {
   const booking = await getAdminSingleBookingService(req.params.id);

   return res
      .status(200)
      .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

// ------ APPROVE BOOKING (ADMIN)

const approveBooking = asyncHandler(async (req, res) => {
   const { adminNotes, estimatedCost } = req.body;

   const booking = await approveBookingService(
      req.params.id,
      adminNotes,
      estimatedCost,
   );

   return res
      .status(200)
      .json(new ApiResponse(200, booking, "Booking approved successfully"));
});

// ------ REJECT BOOKING (ADMIN)

const rejectBooking = asyncHandler(async (req, res) => {
   const { rejectionReason } = req.body;

   const booking = await rejectBookingService(req.params.id, rejectionReason);

   return res
      .status(200)
      .json(new ApiResponse(200, booking, "Booking rejected successfully"));
});

// ------ ASSIGN TECHNICIAN (ADMIN)

const assignTechnician = asyncHandler(async (req, res) => {
   const { technicianName } = req.body;

   if (!technicianName) {
      throw new ApiError(400, "Technician name is required");
   }

   const booking = await assignTechnicianService(
      req.params.id,
      technicianName,
   );

   return res
      .status(200)
      .json(
         new ApiResponse(200, booking, "Technician assigned successfully"),
      );
});

// ------ UPDATE BOOKING STATUS (ADMIN)

const updateBookingStatus = asyncHandler(async (req, res) => {
   const { status, finalCost } = req.body;

   if (!status) {
      throw new ApiError(400, "Status is required");
   }

   const booking = await updateBookingStatusService(
      req.params.id,
      status,
      finalCost,
   );

   return res
      .status(200)
      .json(
         new ApiResponse(200, booking, "Booking status updated successfully"),
      );
});

// ------ EXPORTING CONTROLLERS

export {
   getAllBookings,
   getAdminSingleBooking,
   approveBooking,
   rejectBooking,
   assignTechnician,
   updateBookingStatus,
};
