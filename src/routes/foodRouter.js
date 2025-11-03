import express from "express";
import { createFood, getFood } from "../controllers/food/foodController.js";
import {
  authMiddleware,
  authUserMiddleware,
} from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/addfood", authMiddleware, upload.single("video"), createFood);
router.get("/getallfood", authUserMiddleware, getFood);

export default router;
