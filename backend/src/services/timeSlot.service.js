import mongoose from "mongoose";

import WeeklySchedule from "../models/weeklySchedule.model.js";
import Technician from "../models/technician.model.js";
import Booking from "../models/booking.model.js";
import ApiError from "../utils/ApiError.js";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const initSchedule = async () => {
   const count = await WeeklySchedule.countDocuments();
   if (count < 7) {
      for (const day of DAYS) {
         await WeeklySchedule.updateOne(
            { dayOfWeek: day },
            { $setOnInsert: { dayOfWeek: day, isOpen: true, startTime: "10:00", endTime: "18:00" } },
            { upsert: true }
         );
      }
   }
};

const createTimeSlotService = async () => {
   throw new ApiError(400, "Slot creation is disabled. Use weekly schedule.");
};

const deleteSlotService = async () => {
   throw new ApiError(400, "Slot deletion is disabled. Use weekly schedule.");
};

const getAllSlotsService = async () => {
   await initSchedule();
   const schedule = await WeeklySchedule.find();
   const sorter = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };
   return schedule.sort((a, b) => sorter[a.dayOfWeek] - sorter[b.dayOfWeek]);
};

const updateSlotService = async (id, payload) => {
   const schedule = await WeeklySchedule.findById(id);
   if (!schedule) throw new ApiError(404, "Schedule not found");

   if (payload.isOpen !== undefined) schedule.isOpen = payload.isOpen;
   if (payload.startTime) schedule.startTime = payload.startTime;
   if (payload.endTime) schedule.endTime = payload.endTime;

   await schedule.save();
   return schedule;
};

const getAvailableSlotsService = async (date) => {
   if (!date) return [];
   await initSchedule();

   const targetDate = new Date(date);
   const dayName = targetDate.toLocaleDateString("en-US", { weekday: "long" });

   const schedule = await WeeklySchedule.findOne({ dayOfWeek: dayName });
   if (!schedule || !schedule.isOpen) return [];

   const totalTechnicians = await Technician.countDocuments({ isAvailable: true, status: { $ne: "unavailable" } });
   if (totalTechnicians === 0) return [];

   const startHour = parseInt(schedule.startTime.split(":")[0]);
   const endHour = parseInt(schedule.endTime.split(":")[0]);

   const startOfDay = new Date(targetDate);
   startOfDay.setHours(0, 0, 0, 0);
   const endOfDay = new Date(targetDate);
   endOfDay.setHours(23, 59, 59, 999);

   const bookings = await Booking.find({
      preferredDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ["rejected", "cancelled", "completed"] }
   });

   const availableSlots = [];
   const now = new Date();
   const isToday = targetDate.toDateString() === now.toDateString();

   for (let h = startHour; h < endHour; h++) {
      const timeString = `${h.toString().padStart(2, "0")}:00`;
      
      if (isToday && h <= now.getHours() + 1) { // 1 hour buffer
         continue; 
      }

      const bookingsForHour = bookings.filter(b => b.preferredTime === timeString);
      
      if (bookingsForHour.length < totalTechnicians) {
         availableSlots.push({
            time: timeString,
            availableCapacity: totalTechnicians - bookingsForHour.length
         });
      }
   }

   return availableSlots;
};

export {
   createTimeSlotService,
   getAvailableSlotsService,
   getAllSlotsService,
   updateSlotService,
   deleteSlotService,
};
