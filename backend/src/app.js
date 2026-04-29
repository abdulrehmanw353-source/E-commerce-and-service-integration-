import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URI } from "./constants.js";

// ------ FILES IMPORTING

import errorHandler from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import publicProductRouter from "./routes/public.product.routes.js";
import reviewRouter from "./routes/review.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminOrderRouter from "./routes/admin.order.routes.js";
import customerRouter from "./routes/customer.routes.js";
import adminUserRouter from "./routes/admin.user.routes.js";

// ------ CONFIGURATIONS

const app = express();

const corsOptions = {
   origin: FRONTEND_URI,
   credentials: true,
};

// ------ MIDDLEWARES

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// ------ ROUTES

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/admin/products", productRouter);
app.use("/api/v1/products", publicProductRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/admin/orders", adminOrderRouter);
app.use("/api/v1/admin/users", adminUserRouter);

// ------ ERROR HANDLER MIDDLEWARE

app.use(errorHandler);

// ------ EXPORT EXPRESS APP

export default app;
