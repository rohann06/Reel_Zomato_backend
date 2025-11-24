import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // 🟢 ADD THIS
import authRouter from "./routes/authRouter.js";
import foodRouter from "./routes/foodRouter.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = 5001;

// 🧩 CORS CONFIG
app.use(
  cors({
    origin: "https://foodscroll06.vercel.app", // your frontend URLs
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/food", foodRouter);

// Start server after connecting DB
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
});
