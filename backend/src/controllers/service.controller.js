import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
   createServiceService,
   getAdminServicesService,
   getAdminSingleServiceService,
   updateServiceService,
   deleteServiceService,
   getPublicServicesService,
   getPublicSingleServiceBySlugService,
} from "../services/service.service.js";

// ------ PUBLIC

const getPublicServices = asyncHandler(async (req, res) => {
   const services = await getPublicServicesService();
   return res.status(200).json(new ApiResponse(200, { services }, "Services fetched"));
});

const getPublicServiceBySlug = asyncHandler(async (req, res) => {
   const service = await getPublicSingleServiceBySlugService(req.params.slug);
   return res.status(200).json(new ApiResponse(200, { service }, "Service fetched"));
});

// ------ ADMIN

const createService = asyncHandler(async (req, res) => {
   const service = await createServiceService(req.body, req.user._id);
   return res.status(201).json(new ApiResponse(201, { service }, "Service created"));
});

const getAdminServices = asyncHandler(async (req, res) => {
   const services = await getAdminServicesService();
   return res.status(200).json(new ApiResponse(200, { services }, "Services fetched"));
});

const getAdminSingleService = asyncHandler(async (req, res) => {
   const service = await getAdminSingleServiceService(req.params.id);
   return res.status(200).json(new ApiResponse(200, { service }, "Service fetched"));
});

const updateService = asyncHandler(async (req, res) => {
   const service = await updateServiceService(req.params.id, req.body, req.user._id);
   return res.status(200).json(new ApiResponse(200, { service }, "Service updated"));
});

const deleteService = asyncHandler(async (req, res) => {
   await deleteServiceService(req.params.id);
   return res.status(200).json(new ApiResponse(200, {}, "Service deleted"));
});

export {
   getPublicServices,
   getPublicServiceBySlug,
   createService,
   getAdminServices,
   getAdminSingleService,
   updateService,
   deleteService,
};

