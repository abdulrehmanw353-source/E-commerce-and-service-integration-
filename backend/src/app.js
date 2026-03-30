import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URI } from "./constants.js";

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

app.get("/test", (req, res) => {
   res.send("Hello World");
});

export default app;
