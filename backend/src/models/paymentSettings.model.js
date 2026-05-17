import { Schema, model } from "mongoose";

// ------ PAYMENT SETTINGS SCHEMA (Singleton)

const paymentSettingsSchema = new Schema(
   {
      // ------ JazzCash
      jazzcashEnabled: { type: Boolean, default: false },
      jazzcashAccountName: { type: String, trim: true, default: "" },
      jazzcashAccountNumber: { type: String, trim: true, default: "" },

      // ------ EasyPaisa
      easypaisaEnabled: { type: Boolean, default: false },
      easypaisaAccountName: { type: String, trim: true, default: "" },
      easypaisaAccountNumber: { type: String, trim: true, default: "" },

      // ------ Bank Transfer
      bankEnabled: { type: Boolean, default: false },
      bankName: { type: String, trim: true, default: "" },
      bankAccountName: { type: String, trim: true, default: "" },
      bankAccountNumber: { type: String, trim: true, default: "" },
      bankIBAN: { type: String, trim: true, default: "" },

      // ------ Cash on Delivery
      codEnabled: { type: Boolean, default: true },

      // ------ WhatsApp
      whatsappNumber: { type: String, trim: true, default: "" },

      // ------ Additional Notes
      paymentInstructions: { type: String, trim: true, default: "" },
   },
   {
      timestamps: true,
   }
);

// ------ Ensure singleton: only one document exists
paymentSettingsSchema.statics.getSettings = async function () {
   let settings = await this.findOne();
   if (!settings) {
      settings = await this.create({});
   }
   return settings;
};

// ------ PAYMENT SETTINGS MODEL

const PaymentSettings = model("PaymentSettings", paymentSettingsSchema);
export default PaymentSettings;
