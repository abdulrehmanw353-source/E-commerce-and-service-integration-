import { Schema, model } from "mongoose";

const technicianSchema = new Schema(
   {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      phoneNo: { type: String, required: true, trim: true },
      cnicImage: { type: String, trim: true },
      address: {
         street: { type: String, trim: true },
         city: { type: String, trim: true },
         state: { type: String, trim: true },
         country: { type: String, trim: true },
      },
      expertise: [{ type: String, trim: true }],
      isAvailable: { type: Boolean, default: true },
      status: {
         type: String,
         enum: ["available", "busy", "unavailable"],
         default: "available",
      },
      activeTasks: { type: Number, default: 0, min: 0 },
      createdBy: { type: Schema.Types.ObjectId, ref: "User" },
   },
   { timestamps: true },
);

technicianSchema.index({ status: 1, isAvailable: 1 });

const Technician = model("Technician", technicianSchema);
export default Technician;
