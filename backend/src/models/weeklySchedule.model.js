import { Schema, model } from "mongoose";

const weeklyScheduleSchema = new Schema(
   {
      dayOfWeek: {
         type: String,
         enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
         required: true,
         unique: true,
      },
      isOpen: {
         type: Boolean,
         default: true,
      },
      startTime: {
         type: String,
         default: "10:00", // 24-hour format HH:mm
      },
      endTime: {
         type: String,
         default: "18:00", // 24-hour format HH:mm
      },
   },
   { timestamps: true }
);

const WeeklySchedule = model("WeeklySchedule", weeklyScheduleSchema);
export default WeeklySchedule;
