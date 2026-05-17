import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import Booking from "../models/booking.model.js";
import Technician from "../models/technician.model.js";
import ApiError from "../utils/ApiError.js";
import { recomputeTechnicianLoad } from "./technician.service.js";
import { sendTechnicianReassignmentEmail } from "../utils/email.js";

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
      .populate("technician", "firstName lastName status expertise")
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
      .populate("technician", "firstName lastName status expertise");

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

const assignTechnicianService = async (bookingId, technicianName, technicianId, reassignmentReason, shouldSendEmail) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   if (!technicianName && !technicianId) {
      throw new ApiError(400, "Technician name or technician ID is required");
   }

   const booking = await Booking.findById(bookingId).populate("customer", "firstName lastName email");

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   if (booking.status === "cancelled" || booking.status === "rejected") {
      throw new ApiError(400, "Cannot assign technician to cancelled or rejected booking");
   }

   // Store old technician info for load recomputation + email
   const oldTechnicianId = booking.technician;
   const oldTechnicianName = booking.assignedTechnician || null;

   // Find new technician
   let technician = null;
   if (technicianId && mongoose.Types.ObjectId.isValid(technicianId)) {
      technician = await Technician.findById(technicianId);
   } else if (technicianName) {
      technician = await Technician.findOne({
         $expr: {
            $eq: [
               {
                  $trim: {
                     input: {
                        $concat: ["$firstName", " ", { $ifNull: ["$lastName", ""] }],
                     },
                  },
               },
               technicianName,
            ],
         },
      });
   }
   if (!technician) {
      throw new ApiError(404, "Technician not found");
   }

   // Update booking
   const newTechName = `${technician.firstName} ${technician.lastName || ""}`.trim();
   booking.assignedTechnician = newTechName;
   booking.technician = technician._id;
   if (reassignmentReason) booking.reassignmentReason = reassignmentReason;

   await booking.save();

   // Recompute NEW technician load
   await recomputeTechnicianLoad(technician._id);

   // Recompute OLD technician load (if different from new)
   if (oldTechnicianId && oldTechnicianId.toString() !== technician._id.toString()) {
      await recomputeTechnicianLoad(oldTechnicianId);
   }

   // Send email notification if requested
   if (shouldSendEmail && booking.customer?.email) {
      try {
         await sendTechnicianReassignmentEmail({
            customerEmail: booking.customer.email,
            customerName: `${booking.customer.firstName || ""} ${booking.customer.lastName || ""}`.trim(),
            bookingId: booking._id.toString(),
            oldTechnicianName,
            newTechnicianName: newTechName,
            reassignmentReason: reassignmentReason || "",
            preferredDate: booking.preferredDate,
            preferredTime: booking.preferredTime,
         });
      } catch (emailErr) {
         console.error("[email] Failed to send reassignment email:", emailErr.message);
         // Don't throw — assignment was successful, email is best-effort
      }
   }

   // Re-populate for response
   const populated = await Booking.findById(bookingId)
      .populate("customer", "firstName lastName email phoneNo address")
      .populate("technician", "firstName lastName status expertise");

   return populated;
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
   if (booking.technician) {
      await recomputeTechnicianLoad(booking.technician);
   }

   return booking;
};

// ------ UPDATE BOOKING PAYMENT (ADMIN)

const updateBookingPaymentService = async (bookingId, payload) => {
   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid booking ID");
   }

   const booking = await Booking.findById(bookingId);

   if (!booking) {
      throw new ApiError(404, "Booking not found");
   }

   const { paymentStatus, paymentMethod, advancePaidAmount, remainingBalance, finalCost } = payload;

   if (paymentStatus) {
      const allowedPaymentStatus = [
         "pending_payment",
         "pending_verification",
         "partially_paid",
         "paid",
         "pay_on_completion",
         "cancelled",
         "refunded"
      ];
      if (!allowedPaymentStatus.includes(paymentStatus)) {
         throw new ApiError(400, "Invalid payment status");
      }
      booking.paymentStatus = paymentStatus;
   }

   if (paymentMethod) booking.paymentMethod = paymentMethod;
   if (advancePaidAmount !== undefined) booking.advancePaidAmount = advancePaidAmount;
   if (remainingBalance !== undefined) booking.remainingBalance = remainingBalance;
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
   updateBookingPaymentService,
};
