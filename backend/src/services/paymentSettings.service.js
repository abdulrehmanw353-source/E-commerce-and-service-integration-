// ------ IMPORTING FROM FILES

import PaymentSettings from "../models/paymentSettings.model.js";

// ------ GET PAYMENT SETTINGS

const getPaymentSettingsService = async () => {
   return await PaymentSettings.getSettings();
};

// ------ UPDATE PAYMENT SETTINGS

const updatePaymentSettingsService = async (updates) => {
   let settings = await PaymentSettings.findOne();
   if (!settings) {
      settings = await PaymentSettings.create(updates);
   } else {
      Object.assign(settings, updates);
      await settings.save();
   }
   return settings;
};

// ------ EXPORTING SERVICES

export { getPaymentSettingsService, updatePaymentSettingsService };
