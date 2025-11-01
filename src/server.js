import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = 5001;

// Middle ware
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);

// Start server after connecting the data base
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is runnig on PORT:${PORT}`));
});
