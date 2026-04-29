import cloudinary from "../config/cloudinary.js";
import ApiError from "./ApiError.js";

// ------ UPLOAD TO CLOUDINARY (from buffer)

const uploadToCloudinary = async (fileBuffer, folder = "uploads") => {
   try {
      const result = await new Promise((resolve, reject) => {
         const uploadStream = cloudinary.uploader.upload_stream(
            {
               folder,
               resource_type: "image",
            },
            (error, result) => {
               if (error) reject(error);
               else resolve(result);
            },
         );

         uploadStream.end(fileBuffer);
      });

      return {
         url: result.secure_url,
         publicId: result.public_id,
      };
   } catch (error) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
   }
};

// ------ DELETE FROM CLOUDINARY

const deleteFromCloudinary = async (publicId) => {
   try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
   } catch (error) {
      throw new ApiError(500, "Failed to delete image from Cloudinary");
   }
};

// ------ UPLOAD MULTIPLE FILES

const uploadMultipleToCloudinary = async (files, folder = "uploads") => {
   if (!files || files.length === 0) return [];

   const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.buffer, folder),
   );

   const results = await Promise.all(uploadPromises);

   return results.map((result) => result.url);
};

// ------ EXPORTING UTILS

export { uploadToCloudinary, deleteFromCloudinary, uploadMultipleToCloudinary };
