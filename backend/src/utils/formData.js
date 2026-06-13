import ApiError from "./ApiError.js";

const parseJsonField = (value, fieldName, fallback) => {
   if (value === undefined || value === null || value === "") return fallback;
   if (typeof value !== "string") return value;

   try {
      return JSON.parse(value);
   } catch (_error) {
      throw new ApiError(400, `${fieldName} must be valid JSON`);
   }
};

const normalizeStringArray = (value, fieldName) => {
   const trimmedValue = typeof value === "string" ? value.trim() : value;
   const parsed =
      typeof trimmedValue === "string" && trimmedValue.startsWith("[")
         ? parseJsonField(trimmedValue, fieldName, [])
         : trimmedValue;
   const values = Array.isArray(parsed) ? parsed : [parsed];

   return values
      .flatMap((item) => String(item || "").split(","))
      .map((item) => item.trim())
      .filter(Boolean);
};

export { normalizeStringArray, parseJsonField };
