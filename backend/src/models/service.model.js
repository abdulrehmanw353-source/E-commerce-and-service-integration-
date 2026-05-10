import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
   {
      title: { type: String, required: true, trim: true, unique: true },
      slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
      shortDesc: { type: String, trim: true, maxlength: 240 },
      description: { type: String, trim: true, maxlength: 6000 },
      icon: { type: String, trim: true }, // emoji or icon key
      startingPrice: { type: Number, min: 0, default: 0 },
      isEnabled: { type: Boolean, default: true },
      sortOrder: { type: Number, default: 0 },
      createdBy: { type: Schema.Types.ObjectId, ref: "User" },
      updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
   },
   { timestamps: true },
);

serviceSchema.index({ isEnabled: 1, sortOrder: 1 });

const Service = model("Service", serviceSchema);
export default Service;

