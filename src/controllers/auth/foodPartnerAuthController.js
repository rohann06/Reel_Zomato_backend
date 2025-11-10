import jwt from "jsonwebtoken";
import { foodPartnerModel } from "../../models/foodPartnerMoadel.js";
import bcrypt from "bcryptjs";

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

  if (
    !ownerName ||
    !email ||
    !password ||
    !phone ||
    !restaurantAddress ||
    !restaurantName
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for existing email
    const emailExists = await foodPartnerModel.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "User already exists" });

    // Validate phone number
    if (!/^\d{10}$/.test(String(phone))) {
      return res
        .status(400)
        .json({ message: "Please enter a valid 10-digit phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      ownerName,
      email,
      password: hashedPassword,
      phone,
      restaurantAddress,
      restaurantName,
    });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Cookie setup for Render & Brave
    res.cookie("token", token, {
      httpOnly: false, // set to true if you don’t want frontend JS to read it
      secure: true, // Render uses HTTPS
      sameSite: "none", // required for cross-site requests
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
    console.log("Error in registerFoodPartner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login food partner
export const loginFoodpartner = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner)
      return res
        .status(400)
        .json({ message: "User not found. Please enter a valid email." });

    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password
    );
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      foodPartner: {
        id: foodPartner._id,
        ownerName: foodPartner.ownerName,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.log("Error in loginFoodpartner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout food partner
export const logoutFoodPartner = async (_, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "User logged out successfully." });
};
