import mongoose from "mongoose";

const serviceSettingsSchema = new mongoose.Schema(
   {
      isServiceActive: {
         type: Boolean,
         default: true,
      },
      allowedCities: [
         {
            type: String,
            trim: true,
         },
      ],
      allowedStates: [
         {
            type: String,
            trim: true,
         },
      ],
      allowedCountries: [
         {
            type: String,
            trim: true,
         },
      ],
      defaultPaymentModeRule: {
         type: String,
         enum: [
            "advance_required",
            "pay_after_inspection",
            "pay_after_service_completion",
            "partial_advance"
         ],
         default: "pay_after_service_completion",
      },
      advancePaymentPercentage: {
         type: Number,
         default: 0,
      }
   },
   { timestamps: true }
);

serviceSettingsSchema.statics.getSettings = async function () {
   let settings = await this.findOne();
   if (!settings) {
      settings = await this.create({
         allowedCities: ["sargodha"],
         allowedStates: ["punjab"],
         allowedCountries: ["pakistan"],
      });
   }
   return settings;
};

const ServiceSettings = mongoose.model("ServiceSettings", serviceSettingsSchema);

export default ServiceSettings;
