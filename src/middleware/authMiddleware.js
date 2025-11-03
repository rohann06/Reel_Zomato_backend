import jwt from "jsonwebtoken";
import { foodPartnerModel } from "../models/foodPartnerMoadel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Please login first" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the food partner from DB
    const foodPartner = await foodPartnerModel.findById(decoded.id);
    if (!foodPartner)
      return res
        .status(403)
        .json({ message: "Access denied. Not a food partner." });

    // Attach user info to req
    req.foodPartner = foodPartner;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
