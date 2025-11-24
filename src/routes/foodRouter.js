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
} from "../controllers/food/foodItemController.js";
import { getUserFoodPartnerInfo } from "../controllers/food/userFoodpartnerInfo.js";
import {
  userOrders,
  orderFood,
  foodPartnerOrders,
  completeOrder,
} from "../controllers/food/orderController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

//Post Routes
router.post("/addfood", authMiddleware, upload.single("video"), createFood);
router.post("/foodorder", authUserMiddleware, orderFood);
// Patch Routes
router.patch("/completeorder/:orderId", authMiddleware, completeOrder);
// Get Routes
router.get("/getallfood", authUserMiddleware, getFood);
router.get("/getfoodpartnerinfo", authMiddleware, getFoodPartnerInfo);
router.get("/getfooditem", authMiddleware, getFoodItem);
router.get("/userFoodparterinfo", authUserMiddleware, getUserFoodPartnerInfo);
router.get("/getuserfooditem", authUserMiddleware, getuserFoodItem);
router.get("/userfoodorder", authUserMiddleware, userOrders);
router.get("/foodpartnerfoodorder", authMiddleware, foodPartnerOrders);

export default router;
