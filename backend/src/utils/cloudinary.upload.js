import {
   deleteCloudinaryAsset,
   uploadImageToCloudinary,
   uploadImagesToCloudinary,
} from "../services/upload.service.js";

const uploadToCloudinary = uploadImageToCloudinary;
const deleteFromCloudinary = deleteCloudinaryAsset;
const uploadMultipleToCloudinary = async (files, folder = "uploads") => {
   const assets = await uploadImagesToCloudinary(files, folder);
   return assets.map((asset) => asset.url);
};

export { uploadToCloudinary, deleteFromCloudinary, uploadMultipleToCloudinary };
