import ApiError from "../utils/ApiError.js";

// ------ AUTHORIZE ROLES

const authorizeRoles = (...allowedRoles) => {
   return (req, res, next) => {
      if (!req.user) {
         throw new ApiError(401, "Unauthorized request");
      }

      if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
         throw new ApiError(403, "Access denied");
      }

      next();
   };
};

export default authorizeRoles;
