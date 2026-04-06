import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URI } from "./constants.js";

// ------ FILES IMPORTING

import errorHandler from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";

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

// ------ ERROR HANDLER MIDDLEWARE

app.use(errorHandler);

export default app;
