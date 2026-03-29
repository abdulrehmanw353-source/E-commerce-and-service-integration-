import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const corsOptions = {
   origin: process.env.FRONTEND_URI,
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
