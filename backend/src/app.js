import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URI } from "./constants.js";

// ------ FILES IMPORTING

import errorHandler from "./middlewares/error.middleware.js";

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

// ------ ERROR HANDLER MIDDLEWARE

app.use(errorHandler);

export default app;
