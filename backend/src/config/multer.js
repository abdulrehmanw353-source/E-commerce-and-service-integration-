import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import { unlink } from "fs/promises";
import { extname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import ApiError from "../utils/ApiError.js";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;
const TEMP_DIRECTORY = fileURLToPath(new URL("../../temp/", import.meta.url));

const allowedImageTypes = new Map([
   ["image/jpeg", ".jpg"],
   ["image/png", ".png"],
   ["image/webp", ".webp"],
]);

mkdirSync(TEMP_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
   destination: (_req, _file, cb) => cb(null, TEMP_DIRECTORY),
   filename: (_req, file, cb) => {
      const extension = allowedImageTypes.get(file.mimetype);
      cb(null, `${Date.now()}-${randomUUID()}${extension}`);
   },
});

const fileFilter = (_req, file, cb) => {
   const extension = extname(file.originalname).toLowerCase();
   const expectedExtension = allowedImageTypes.get(file.mimetype);
   const allowedExtensions =
      file.mimetype === "image/jpeg" ? [".jpg", ".jpeg"] : [expectedExtension];

   if (expectedExtension && allowedExtensions.includes(extension)) {
      return cb(null, true);
   }

   return cb(
      new ApiError(400, "Only jpg, jpeg, png and webp images are allowed"),
      false,
   );
};

const upload = multer({
   storage,
   fileFilter,
   limits: {
      fileSize: MAX_IMAGE_SIZE,
      files: MAX_FILES_PER_REQUEST,
   },
});

const getRequestFiles = (req) => {
   if (req.file) return [req.file];
   if (Array.isArray(req.files)) return req.files;
   if (req.files && typeof req.files === "object") {
      return Object.values(req.files).flat();
   }
   return [];
};

const removeRequestTempFiles = async (req) => {
   await Promise.all(
      getRequestFiles(req).map(async (file) => {
         if (!file?.path) return;
         try {
            await unlink(file.path);
         } catch (error) {
            if (error.code !== "ENOENT") {
               console.error(`Failed to remove temporary upload: ${error.message}`);
            }
         }
      }),
   );
};

const withUploadCleanup = (multerMiddleware) => (req, res, next) => {
   multerMiddleware(req, res, (error) => {
      if (error) {
         removeRequestTempFiles(req).finally(() => next(error));
         return;
      }

      const cleanup = () => {
         removeRequestTempFiles(req);
      };

      res.once("finish", cleanup);
      res.once("close", cleanup);
      next();
   });
};

const uploadImages = (fieldName, maxCount = MAX_FILES_PER_REQUEST) =>
   withUploadCleanup(upload.array(fieldName, maxCount));

const uploadImage = (fieldName) =>
   withUploadCleanup(upload.single(fieldName));

export {
   MAX_IMAGE_SIZE,
   TEMP_DIRECTORY,
   uploadImage,
   uploadImages,
};

export default upload;
