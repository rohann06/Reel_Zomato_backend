import express from "express";
import { createFood, getFood } from "../controllers/food/foodController.js";
import {
  authMiddleware,
  authUserMiddleware,
} from "../middleware/authMiddleware.js";
import multer from "multer";
import { getFoodPartnerInfo } from "../controllers/food/foodPartnerInfo.js";
import { getFoodItem } from "../controllers/food/FoodItemController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/addfood", authMiddleware, upload.single("video"), createFood);
router.get("/getallfood", authUserMiddleware, getFood);
router.get("/getfoodpartnerinfo", authMiddleware, getFoodPartnerInfo);
router.get("/getfooditem", authMiddleware, getFoodItem);

export default router;
