import { unlink } from "fs/promises";
import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

const removeTempFile = async (filePath) => {
   if (!filePath) return;

   try {
      await unlink(filePath);
   } catch (error) {
      if (error.code !== "ENOENT") {
         console.error(`Failed to remove temporary upload: ${error.message}`);
      }
   }
};

const deleteCloudinaryAsset = async (publicId) => {
   if (!publicId) return;

   try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
   } catch (error) {
      console.error(`Failed to roll back Cloudinary image: ${error.message}`);
   }
};

const deleteCloudinaryAssets = async (assets = []) => {
   await Promise.all(assets.map((asset) => deleteCloudinaryAsset(asset.publicId)));
};

const uploadImageToCloudinary = async (file, folder = "uploads") => {
   if (!file?.path) {
      throw new ApiError(400, "A valid image file is required");
   }

   try {
      const result = await cloudinary.uploader.upload(file.path, {
         folder,
         resource_type: "image",
      });

      return {
         url: result.secure_url,
         publicId: result.public_id,
      };
   } catch (_error) {
      throw new ApiError(502, "Failed to upload image to Cloudinary");
   } finally {
      await removeTempFile(file.path);
   }
};

const uploadImagesToCloudinary = async (files = [], folder = "uploads") => {
   if (!files.length) return [];

   const results = await Promise.allSettled(
      files.map((file) => uploadImageToCloudinary(file, folder)),
   );
   const uploadedAssets = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
   const failedUpload = results.find((result) => result.status === "rejected");

   if (failedUpload) {
      await deleteCloudinaryAssets(uploadedAssets);
      throw failedUpload.reason;
   }

   return uploadedAssets;
};

export {
   deleteCloudinaryAsset,
   deleteCloudinaryAssets,
   removeTempFile,
   uploadImageToCloudinary,
   uploadImagesToCloudinary,
};
