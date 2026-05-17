import mongoose from "mongoose";

const deliveryTaxSettingsSchema = new mongoose.Schema(
   {
      taxEnabled: {
         type: Boolean,
         default: false,
      },
      taxPercentage: {
         type: Number,
         default: 0,
      },
      categoryRules: [
         {
            category: {
               type: String,
               required: true,
            },
            deliveryCharge: {
               type: Number,
               default: 0,
            },
            expectedDeliveryDays: {
               type: Number,
               default: 3,
            },
         },
      ],
   },
   { timestamps: true }
);

deliveryTaxSettingsSchema.statics.getSettings = async function () {
   let settings = await this.findOne();
   if (!settings) {
      settings = await this.create({});
   }
   return settings;
};

const DeliveryTaxSettings = mongoose.model("DeliveryTaxSettings", deliveryTaxSettingsSchema);

export default DeliveryTaxSettings;
