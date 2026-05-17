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
      preferredTime: {
         type: String,
         required: true,
      },
      technician: {
         type: Schema.Types.ObjectId,
         ref: "Technician",
      },

      // ------ Location
      location: {
         address: { type: String, trim: true },
         city: { type: String, trim: true },
         state: { type: String, trim: true },
         zip: { type: String, trim: true },
         country: { type: String, trim: true },
         lat: Number,
         lng: Number,
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
      reassignmentReason: {
         type: String,
         trim: true,
      },

      // ------ Pricing
      estimatedCost: {
         type: Number,
         min: 0,
         default: 0,
      },
      finalCost: {
         type: Number,
         min: 0,
         default: 0,
      },

      // ------ Payment Management
      paymentMethod: {
         type: String,
         enum: ["cod", "jazzcash", "easypaisa", "bank_transfer"],
         default: "cod",
      },
      paymentStatus: {
         type: String,
         enum: [
            "pending_payment",
            "pending_verification",
            "partially_paid",
            "paid",
            "pay_on_completion",
            "cancelled",
            "refunded"
         ],
         default: "pending_payment",
      },
      paymentModeRule: {
         type: String,
         enum: [
            "advance_required",
            "pay_after_inspection",
            "pay_after_service_completion",
            "partial_advance"
         ],
         default: "pay_after_service_completion",
      },
      advancePaidAmount: {
         type: Number,
         min: 0,
         default: 0,
      },
      remainingBalance: {
         type: Number,
         min: 0,
         default: 0,
      },
      paymentProofImage: {
         type: String, // Cloudinary URL if user uploads payment proof
      },
   },
   {
      timestamps: true,
   },
);

// ------ INDEXES

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ technician: 1, preferredDate: 1, preferredTime: 1 });

// ------ BOOKING MODEL

const Booking = model("Booking", bookingSchema);
export default Booking;
