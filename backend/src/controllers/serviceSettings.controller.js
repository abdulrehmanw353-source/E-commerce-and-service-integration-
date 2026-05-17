import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ServiceSettings from "../models/serviceSettings.model.js";

// ------ GET SETTINGS
export const getServiceSettings = asyncHandler(async (req, res) => {
   const settings = await ServiceSettings.getSettings();
   return res
      .status(200)
      .json(new ApiResponse(200, settings, "Service settings fetched successfully"));
});

// ------ UPDATE SETTINGS
export const updateServiceSettings = asyncHandler(async (req, res) => {
   const {
      isServiceActive,
      allowedCities,
      allowedStates,
      allowedCountries,
      defaultPaymentModeRule,
      advancePaymentPercentage,
   } = req.body;

   let settings = await ServiceSettings.findOne();
   if (!settings) {
      settings = new ServiceSettings();
   }

   if (isServiceActive !== undefined) settings.isServiceActive = isServiceActive;
   if (allowedCities) settings.allowedCities = Array.isArray(allowedCities) ? allowedCities : [allowedCities];
   if (allowedStates) settings.allowedStates = Array.isArray(allowedStates) ? allowedStates : [allowedStates];
   if (allowedCountries) settings.allowedCountries = Array.isArray(allowedCountries) ? allowedCountries : [allowedCountries];
   if (defaultPaymentModeRule) settings.defaultPaymentModeRule = defaultPaymentModeRule;
   if (advancePaymentPercentage !== undefined) settings.advancePaymentPercentage = advancePaymentPercentage;

   await settings.save();

   return res
      .status(200)
      .json(new ApiResponse(200, settings, "Service settings updated successfully"));
});
