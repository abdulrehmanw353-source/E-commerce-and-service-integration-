import mongoose from "mongoose";

// ------ IMPORTING FROM FILES

import TimeSlot from "../models/timeSlot.model.js";
import ApiError from "../utils/ApiError.js";

// ------ CREATE TIME SLOT (ADMIN)

const createTimeSlotService = async (payload, userId) => {
   if (!payload.date || !payload.startTime || !payload.endTime) {
      throw new ApiError(400, "Date, start time and end time are required");
   }

   // ------ check for duplicate slot
   const existingSlot = await TimeSlot.findOne({
      date: payload.date,
      startTime: payload.startTime,
   });

   if (existingSlot) {
      throw new ApiError(409, "Time slot already exists for this date and time");
   }

   const slot = await TimeSlot.create({
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      isAvailable: payload.isAvailable !== undefined ? payload.isAvailable : true,
      maxBookings: payload.maxBookings || 1,
      createdBy: userId,
   });

   return slot;
};

// ------ GET AVAILABLE SLOTS (PUBLIC)

const getAvailableSlotsService = async (date) => {
   if (!date) {
      throw new ApiError(400, "Date is required");
   }

   // ------ find slots where available and has capacity
   const slots = await TimeSlot.find({
      date: new Date(date),
      isAvailable: true,
      $expr: { $lt: ["$currentBookings", "$maxBookings"] },
   }).sort({ startTime: 1 });

   return slots;
};

// ------ GET ALL SLOTS (ADMIN)

const getAllSlotsService = async (query) => {
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
   const skip = (page - 1) * limit;

   const filter = {};

   // ------ filter by date
   if (query.date) {
      filter.date = new Date(query.date);
   }

   // ------ filter by availability
   if (query.isAvailable !== undefined) {
      filter.isAvailable = query.isAvailable === "true";
   }

   const slots = await TimeSlot.find(filter)
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

   const totalSlots = await TimeSlot.countDocuments(filter);

   return {
      slots,
      totalSlots,
      page,
      totalPages: Math.ceil(totalSlots / limit),
   };
};

// ------ UPDATE SLOT (ADMIN)

const updateSlotService = async (slotId, payload) => {
   if (!mongoose.Types.ObjectId.isValid(slotId)) {
      throw new ApiError(400, "Invalid slot ID");
   }

   const slot = await TimeSlot.findById(slotId);

   if (!slot) {
      throw new ApiError(404, "Time slot not found");
   }

   const allowedFields = [
      "date",
      "startTime",
      "endTime",
      "isAvailable",
      "maxBookings",
   ];

   allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
         slot[field] = payload[field];
      }
   });

   await slot.save();

   return slot;
};

// ------ DELETE SLOT (ADMIN)

const deleteSlotService = async (slotId) => {
   if (!mongoose.Types.ObjectId.isValid(slotId)) {
      throw new ApiError(400, "Invalid slot ID");
   }

   const slot = await TimeSlot.findById(slotId);

   if (!slot) {
      throw new ApiError(404, "Time slot not found");
   }

   // ------ prevent deletion if slot has active bookings
   if (slot.currentBookings > 0) {
      throw new ApiError(400, "Cannot delete slot with active bookings");
   }

   await TimeSlot.findByIdAndDelete(slotId);

   return true;
};

// ------ EXPORTING SERVICES

export {
   createTimeSlotService,
   getAvailableSlotsService,
   getAllSlotsService,
   updateSlotService,
   deleteSlotService,
};
