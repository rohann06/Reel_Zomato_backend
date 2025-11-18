import express from "express";
import {
  authMiddleware,
  authUserMiddleware,
} from "../middleware/authMiddleware.js";
import multer from "multer";
//Controllers
import { createFood, getFood } from "../controllers/food/foodController.js";
import { getFoodPartnerInfo } from "../controllers/food/foodPartnerInfo.js";
import {
  getFoodItem,
  getuserFoodItem,
} from "../controllers/food/FoodItemController.js";
import { getUserFoodPartnerInfo } from "../controllers/food/userFoodpartnerInfo.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/addfood", authMiddleware, upload.single("video"), createFood);
router.get("/getallfood", authUserMiddleware, getFood);
router.get("/getfoodpartnerinfo", authMiddleware, getFoodPartnerInfo);
router.get("/getfooditem", authMiddleware, getFoodItem);
router.get("/userFoodparterinfo", authUserMiddleware, getUserFoodPartnerInfo);
router.get("/getuserfooditem", authUserMiddleware, getuserFoodItem);

export default router;
