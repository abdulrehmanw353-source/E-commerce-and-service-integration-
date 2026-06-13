import multer from "multer";

const errorHandler = (err, req, res, next) => {
   let statusCode = err.statusCode || 500;
   let message = err.message || "Internal Server Error";

   if (err instanceof multer.MulterError) {
      statusCode = 400;

      if (err.code === "LIMIT_FILE_SIZE") {
         message = "Each image must be 5MB or smaller";
      } else if (err.code === "LIMIT_FILE_COUNT") {
         message = "Too many images were selected";
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
         message = "Unexpected image field or too many images";
      }
   }

   res.status(statusCode).json({
      success: false,
      message,
      errors: err.errors || [],
   });
};

export default errorHandler;
