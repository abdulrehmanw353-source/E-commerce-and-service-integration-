import { Schema, model } from "mongoose";

// ------ TIME SLOT SCHEMA

const timeSlotSchema = new Schema(
   {
      date: {
         type: Date,
         required: true,
      },
      startTime: {
         type: String,
         required: true,
         trim: true,
      },
      endTime: {
         type: String,
         required: true,
         trim: true,
      },
      isAvailable: {
         type: Boolean,
         default: true,
      },
      maxBookings: {
         type: Number,
         default: 1,
         min: 1,
      },
      currentBookings: {
         type: Number,
         default: 0,
         min: 0,
      },
      createdBy: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },
   },
   {
      timestamps: true,
   },
);

// ------ COMPOUND INDEX (unique slot per date + time)

timeSlotSchema.index({ date: 1, startTime: 1 }, { unique: true });

// ------ TIME SLOT MODEL

const TimeSlot = model("TimeSlot", timeSlotSchema);
export default TimeSlot;
