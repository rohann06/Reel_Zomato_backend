import express from "express";
import { createFood } from "../controllers/food/foodController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});
router.post("/addfood", authMiddleware, upload.single("video"), createFood);

export default router;
