import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   getDeliveryTaxSettingsService,
   updateDeliveryTaxSettingsService,
} from "../services/deliveryTaxSettings.service.js";

const getDeliveryTaxSettings = asyncHandler(async (req, res) => {
   const settings = await getDeliveryTaxSettingsService();
   return res
      .status(200)
      .json(new ApiResponse(200, settings, "Settings fetched successfully"));
});

const updateDeliveryTaxSettings = asyncHandler(async (req, res) => {
   const settings = await updateDeliveryTaxSettingsService(req.body);
   return res
      .status(200)
      .json(new ApiResponse(200, settings, "Settings updated successfully"));
});

export { getDeliveryTaxSettings, updateDeliveryTaxSettings };
