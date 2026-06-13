import mongoose from "mongoose";
import Technician from "../models/technician.model.js";
import Booking from "../models/booking.model.js";
import ApiError from "../utils/ApiError.js";
import { normalizeStringArray, parseJsonField } from "../utils/formData.js";
import {
   deleteCloudinaryAssets,
   uploadImageToCloudinary,
} from "./upload.service.js";

const ACTIVE_BOOKING_STATUSES = ["pending", "approved", "in-progress"];

const deriveStatusFromTasks = (activeTasks, isAvailable) => {
   if (!isAvailable) return "unavailable";
   return activeTasks >= 5 ? "busy" : "available";
};

const recomputeTechnicianLoad = async (technicianId) => {
   const activeTasks = await Booking.countDocuments({
      technician: technicianId,
      status: { $in: ACTIVE_BOOKING_STATUSES },
   });

   const technician = await Technician.findById(technicianId);
   if (!technician) return null;

   technician.activeTasks = activeTasks;
   technician.status = deriveStatusFromTasks(activeTasks, technician.isAvailable);
   await technician.save({ validateBeforeSave: false });
   return technician;
};

const createTechnicianService = async (payload, adminId, file) => {
   const required = ["firstName", "email", "phoneNo"];
   for (const field of required) {
      if (!payload[field]) throw new ApiError(400, `${field} is required`);
   }

   const exists = await Technician.findOne({ email: payload.email.toLowerCase() });
   if (exists) throw new ApiError(409, "Technician already exists with this email");

   const uploadedAsset = file
      ? await uploadImageToCloudinary(file, "technicians/cnic")
      : null;

   try {
      const { cnicImage: _cnicImage, ...technicianData } = payload;
      return await Technician.create({
         ...technicianData,
         address: parseJsonField(payload.address, "address", undefined),
         createdBy: adminId,
         expertise: normalizeStringArray(payload.expertise || [], "expertise"),
         ...(uploadedAsset ? { cnicImage: uploadedAsset.url } : {}),
      });
   } catch (error) {
      await deleteCloudinaryAssets(uploadedAsset ? [uploadedAsset] : []);
      throw error;
   }
};

const getAllTechniciansService = async (query) => {
   const page = Math.max(1, Number(query.page) || 1);
   const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
   const skip = (page - 1) * limit;
   const filter = {};

   if (query.status) filter.status = query.status;
   if (query.isAvailable !== undefined) filter.isAvailable = query.isAvailable === "true";
   if (query.search) {
      const regex = new RegExp(query.search, "i");
      filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
   }

   const technicians = await Technician.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
   const totalTechnicians = await Technician.countDocuments(filter);
   return { technicians, totalTechnicians, page, totalPages: Math.ceil(totalTechnicians / limit) };
};

const getSingleTechnicianService = async (id) => {
   if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid technician ID");
   const technician = await Technician.findById(id);
   if (!technician) throw new ApiError(404, "Technician not found");
   return technician;
};

const updateTechnicianService = async (id, payload, file) => {
   if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid technician ID");
   const technician = await Technician.findById(id);
   if (!technician) throw new ApiError(404, "Technician not found");

   const uploadedAsset = file
      ? await uploadImageToCloudinary(file, "technicians/cnic")
      : null;
   try {
      const allowed = [
         "firstName",
         "lastName",
         "email",
         "phoneNo",
         "address",
         "expertise",
         "isAvailable",
      ];
      for (const field of allowed) {
         if (payload[field] === undefined) continue;

         if (field === "address") {
            technician[field] = parseJsonField(payload[field], field, {});
         } else if (field === "expertise") {
            technician[field] = normalizeStringArray(payload[field], field);
         } else {
            technician[field] = payload[field];
         }
      }

      if (uploadedAsset) {
         technician.cnicImage = uploadedAsset.url;
      }

      technician.status = deriveStatusFromTasks(technician.activeTasks, technician.isAvailable);
      await technician.save();
   } catch (error) {
      await deleteCloudinaryAssets(uploadedAsset ? [uploadedAsset] : []);
      throw error;
   }
   return technician;
};

const deleteTechnicianService = async (id) => {
   if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid technician ID");
   const technician = await Technician.findById(id);
   if (!technician) throw new ApiError(404, "Technician not found");

   const activeTasks = await Booking.countDocuments({
      technician: id,
      status: { $in: ACTIVE_BOOKING_STATUSES },
   });
   if (activeTasks > 0) {
      throw new ApiError(400, "Cannot delete technician with active tasks");
   }

   await Technician.findByIdAndDelete(id);
   return true;
};

const getPublicAvailableTechniciansService = async () => {
   return Technician.find({ isAvailable: true, status: { $in: ["available", "busy"] } })
      .select("firstName lastName expertise status")
      .sort({ status: 1, firstName: 1 });
};

export {
   createTechnicianService,
   getAllTechniciansService,
   getSingleTechnicianService,
   updateTechnicianService,
   deleteTechnicianService,
   getPublicAvailableTechniciansService,
   recomputeTechnicianLoad,
   ACTIVE_BOOKING_STATUSES,
};
