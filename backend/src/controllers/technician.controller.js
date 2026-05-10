import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   createTechnicianService,
   getAllTechniciansService,
   getSingleTechnicianService,
   updateTechnicianService,
   deleteTechnicianService,
   getPublicAvailableTechniciansService,
} from "../services/technician.service.js";

const createTechnician = asyncHandler(async (req, res) => {
   const technician = await createTechnicianService(req.body, req.user._id);
   return res.status(201).json(new ApiResponse(201, technician, "Technician created successfully"));
});

const getAllTechnicians = asyncHandler(async (req, res) => {
   const result = await getAllTechniciansService(req.query);
   return res.status(200).json(new ApiResponse(200, result, "Technicians fetched successfully"));
});

const getSingleTechnician = asyncHandler(async (req, res) => {
   const technician = await getSingleTechnicianService(req.params.id);
   return res.status(200).json(new ApiResponse(200, technician, "Technician fetched successfully"));
});

const updateTechnician = asyncHandler(async (req, res) => {
   const technician = await updateTechnicianService(req.params.id, req.body);
   return res.status(200).json(new ApiResponse(200, technician, "Technician updated successfully"));
});

const deleteTechnician = asyncHandler(async (req, res) => {
   await deleteTechnicianService(req.params.id);
   return res.status(200).json(new ApiResponse(200, {}, "Technician deleted successfully"));
});

const getPublicAvailableTechnicians = asyncHandler(async (_req, res) => {
   const technicians = await getPublicAvailableTechniciansService();
   return res.status(200).json(new ApiResponse(200, technicians, "Available technicians fetched successfully"));
});

export {
   createTechnician,
   getAllTechnicians,
   getSingleTechnician,
   updateTechnician,
   deleteTechnician,
   getPublicAvailableTechnicians,
};
