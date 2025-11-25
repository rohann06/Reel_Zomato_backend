import jwt from "jsonwebtoken";
import { foodPartnerModel } from "../../models/foodPartnerMoadel.js";
import bcrypt from "bcryptjs";

// Helper function for cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" for cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

// Register food partner
export const registerFoodPartner = async (req, res) => {
  const {
    ownerName,
    email,
    password,
    phone,
    restaurantAddress,
    restaurantName,
  } = req.body;

  try {
    // Check if user already exists
    const emailExists = await foodPartnerModel.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "User already exists" });

    // Validate phone
    if (!/^\d{10}$/.test(String(phone))) {
      return res
        .status(400)
        .json({ message: "Please enter a valid 10-digit phone number" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const foodPartner = await foodPartnerModel.create({
      ownerName,
      email,
      password: hashedPassword,
      phone,
      restaurantAddress,
      restaurantName,
    });

    // Generate JWT
    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with proper options
    res.cookie("token", token, getCookieOptions());

    res.status(201).json({
      message: "Food partner created successfully",
      foodPartner: {
        _id: foodPartner._id,
        ownerName: foodPartner.ownerName,
        email: foodPartner.email,
        phone: foodPartner.phone,
        restaurantAddress: foodPartner.restaurantAddress,
        restaurantName: foodPartner.restaurantName,
      },
    });
  } catch (error) {
    console.error("Error in registerFoodPartner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login food partner
export const loginFoodpartner = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner)
      return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password
    );
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with proper options
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      message: "User logged in successfully",
      foodPartner: {
        _id: foodPartner._id,
        ownerName: foodPartner.ownerName,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.error("Error in loginFoodpartner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout food partner
export const logoutFoodPartner = async (_, res) => {
  res.clearCookie("token", getCookieOptions());
  res.status(200).json({ message: "User logged out successfully." });
};
