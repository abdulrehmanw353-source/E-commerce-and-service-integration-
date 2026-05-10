import mongoose from "mongoose";
import Service from "../models/service.model.js";
import ApiError from "../utils/ApiError.js";

const slugify = (s = "") =>
   String(s)
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

// ------ ADMIN CRUD

const createServiceService = async (payload, userId) => {
   if (!payload?.title) throw new ApiError(400, "Service title is required");

   const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
   if (!slug) throw new ApiError(400, "Invalid service slug");

   const exists = await Service.findOne({ $or: [{ title: payload.title }, { slug }] });
   if (exists) throw new ApiError(409, "Service already exists");

   return await Service.create({
      title: payload.title,
      slug,
      shortDesc: payload.shortDesc,
      description: payload.description,
      icon: payload.icon,
      startingPrice: payload.startingPrice ?? 0,
      isEnabled: payload.isEnabled ?? true,
      sortOrder: payload.sortOrder ?? 0,
      createdBy: userId,
      updatedBy: userId,
   });
};

const getAdminServicesService = async () => {
   return await Service.find({}).sort({ sortOrder: 1, createdAt: -1 });
};

const getAdminSingleServiceService = async (id) => {
   if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid service ID");
   const service = await Service.findById(id);
   if (!service) throw new ApiError(404, "Service not found");
   return service;
};

const updateServiceService = async (id, payload, userId) => {
   if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid service ID");
   const service = await Service.findById(id);
   if (!service) throw new ApiError(404, "Service not found");

   const allowed = ["title", "slug", "shortDesc", "description", "icon", "startingPrice", "isEnabled", "sortOrder"];
   allowed.forEach((k) => {
      if (payload?.[k] !== undefined) service[k] = payload[k];
   });

   if (payload?.title && !payload?.slug) {
      service.slug = slugify(payload.title);
   }
   if (payload?.slug) {
      service.slug = slugify(payload.slug);
   }

   service.updatedBy = userId;
   await service.save();
   return service;
};

const deleteServiceService = async (id) => {
   if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid service ID");
   const service = await Service.findById(id);
   if (!service) throw new ApiError(404, "Service not found");
   await service.deleteOne();
   return true;
};

// ------ PUBLIC

const getPublicServicesService = async () => {
   return await Service.find({ isEnabled: true })
      .select("title slug shortDesc icon startingPrice sortOrder")
      .sort({ sortOrder: 1, createdAt: -1 });
};

const getPublicSingleServiceBySlugService = async (slug) => {
   const service = await Service.findOne({ slug: String(slug || "").toLowerCase(), isEnabled: true });
   if (!service) throw new ApiError(404, "Service not found");
   return service;
};

export {
   createServiceService,
   getAdminServicesService,
   getAdminSingleServiceService,
   updateServiceService,
   deleteServiceService,
   getPublicServicesService,
   getPublicSingleServiceBySlugService,
};

