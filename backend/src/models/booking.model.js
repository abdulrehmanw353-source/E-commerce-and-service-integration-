import { Schema, model } from "mongoose";

// ------ BOOKING SCHEMA

const bookingSchema = new Schema(
   {
      customer: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },

      // ------ Problem Details
      problemTitle: {
         type: String,
         required: true,
         trim: true,
      },
      problemDescription: {
         type: String,
         required: true,
         trim: true,
         maxlength: 3000,
      },

      // ------ Device Details
      deviceType: {
         type: String,
         required: true,
         enum: ["laptop", "desktop", "mobile", "tablet", "other"],
      },
      deviceBrand: {
         type: String,
         trim: true,
      },
      deviceModel: {
         type: String,
         trim: true,
      },

      // ------ Images (Cloudinary URLs)
      images: [
         {
            type: String,
         },
      ],

      // ------ Scheduling
      preferredDate: {
         type: Date,
         required: true,
      },
      preferredTimeSlot: {
         type: Schema.Types.ObjectId,
         ref: "TimeSlot",
      },

      // ------ Status Management
      status: {
         type: String,
         enum: [
            "pending",
            "approved",
            "in-progress",
            "completed",
            "rejected",
            "cancelled",
         ],
         default: "pending",
      },

      // ------ Admin Assignment
      assignedTechnician: {
         type: String,
         trim: true,
      },
      adminNotes: {
         type: String,
         trim: true,
      },
      rejectionReason: {
         type: String,
         trim: true,
      },

      // ------ Pricing
      estimatedCost: {
         type: Number,
         min: 0,
      },
      finalCost: {
         type: Number,
         min: 0,
      },
   },
   {
      timestamps: true,
   },
);

// ------ INDEXES

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });

// ------ BOOKING MODEL

const Booking = model("Booking", bookingSchema);
export default Booking;
