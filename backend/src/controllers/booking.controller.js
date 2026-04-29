// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   createBookingService,
   getCustomerBookingsService,
   getSingleBookingService,
   cancelBookingService,
} from "../services/booking.service.js";

// ------ CREATE BOOKING

const createBooking = asyncHandler(async (req, res) => {
   const booking = await createBookingService(req.user._id, req.body);

   return res
      .status(201)
      .json(new ApiResponse(201, booking, "Booking created successfully"));
});

// ------ GET CUSTOMER BOOKINGS

const getCustomerBookings = asyncHandler(async (req, res) => {
   const result = await getCustomerBookingsService(req.user._id, req.query);

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Bookings fetched successfully"));
});

// ------ GET SINGLE BOOKING

const getSingleBooking = asyncHandler(async (req, res) => {
   const booking = await getSingleBookingService(req.params.id, req.user._id);

   return res
      .status(200)
      .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

// ------ CANCEL BOOKING

const cancelBooking = asyncHandler(async (req, res) => {
   const booking = await cancelBookingService(req.params.id, req.user._id);

   return res
      .status(200)
      .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

// ------ EXPORTING CONTROLLERS

export { createBooking, getCustomerBookings, getSingleBooking, cancelBooking };
