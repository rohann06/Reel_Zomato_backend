import express from "express";
import { addFoodController } from "../controllers/food/foodControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addfood", authMiddleware, addFoodController);

export default router;
