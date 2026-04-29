import multer from "multer";
import ApiError from "../utils/ApiError.js";

// ------ MULTER MEMORY STORAGE (for Cloudinary buffer uploads)

const storage = multer.memoryStorage();

// ------ FILE FILTER (images only)

const fileFilter = (req, file, cb) => {
   const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
   ];

   if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(
         new ApiError(400, "Only jpeg, jpg, png and webp images are allowed"),
         false,
      );
   }
};

// ------ MULTER UPLOAD INSTANCE

const upload = multer({
   storage,
   fileFilter,
   limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max per file
      files: 5, // max 5 files
   },
});

export default upload;
