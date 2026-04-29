// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   createTimeSlotService,
   getAvailableSlotsService,
   getAllSlotsService,
   updateSlotService,
   deleteSlotService,
} from "../services/timeSlot.service.js";

// ------ CREATE TIME SLOT (ADMIN)

const createTimeSlot = asyncHandler(async (req, res) => {
   const slot = await createTimeSlotService(req.body, req.user._id);

   return res
      .status(201)
      .json(new ApiResponse(201, slot, "Time slot created successfully"));
});

// ------ GET AVAILABLE SLOTS (PUBLIC)

const getAvailableSlots = asyncHandler(async (req, res) => {
   const slots = await getAvailableSlotsService(req.query.date);

   return res
      .status(200)
      .json(
         new ApiResponse(200, slots, "Available slots fetched successfully"),
      );
});

// ------ GET ALL SLOTS (ADMIN)

const getAllSlots = asyncHandler(async (req, res) => {
   const result = await getAllSlotsService(req.query);

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Slots fetched successfully"));
});

// ------ UPDATE SLOT (ADMIN)

const updateSlot = asyncHandler(async (req, res) => {
   const slot = await updateSlotService(req.params.id, req.body);

   return res
      .status(200)
      .json(new ApiResponse(200, slot, "Slot updated successfully"));
});

// ------ DELETE SLOT (ADMIN)

const deleteSlot = asyncHandler(async (req, res) => {
   await deleteSlotService(req.params.id);

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Slot deleted successfully"));
});

// ------ EXPORTING CONTROLLERS

export {
   createTimeSlot,
   getAvailableSlots,
   getAllSlots,
   updateSlot,
   deleteSlot,
};
