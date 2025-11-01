import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth/userAuthController.js";

import { registerFoodPartner } from "../controllers/auth/foodPartnerAuthController.js";

const router = express.Router();

// User auth APIs
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/user/logout", logoutUser);

// food partner auth APIs
router.post("/food-partner/register", registerFoodPartner);

export default router;
