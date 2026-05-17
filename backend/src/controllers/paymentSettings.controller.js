// ------ IMPORTING FROM FILES

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   getPaymentSettingsService,
   updatePaymentSettingsService,
} from "../services/paymentSettings.service.js";

// ------ GET PAYMENT SETTINGS (PUBLIC)

const getPaymentSettings = asyncHandler(async (req, res) => {
   const settings = await getPaymentSettingsService();

   return res
      .status(200)
      .json(new ApiResponse(200, settings, "Payment settings fetched"));
});

// ------ UPDATE PAYMENT SETTINGS (ADMIN)

const updatePaymentSettings = asyncHandler(async (req, res) => {
   const settings = await updatePaymentSettingsService(req.body);

   return res
      .status(200)
      .json(new ApiResponse(200, settings, "Payment settings updated"));
});

// ------ EXPORTING CONTROLLERS

export { getPaymentSettings, updatePaymentSettings };
