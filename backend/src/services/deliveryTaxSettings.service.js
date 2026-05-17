import DeliveryTaxSettings from "../models/deliveryTaxSettings.model.js";

const getDeliveryTaxSettingsService = async () => {
   const settings = await DeliveryTaxSettings.getSettings();
   return settings;
};

const updateDeliveryTaxSettingsService = async (updateData) => {
   const settings = await DeliveryTaxSettings.getSettings();
   
   if (updateData.taxEnabled !== undefined) settings.taxEnabled = updateData.taxEnabled;
   if (updateData.taxPercentage !== undefined) settings.taxPercentage = updateData.taxPercentage;
   
   if (updateData.categoryRules) {
      settings.categoryRules = updateData.categoryRules;
   }

   await settings.save();
   return settings;
};

export { getDeliveryTaxSettingsService, updateDeliveryTaxSettingsService };
