import jwt from "jsonwebtoken";
import { userModel } from "../../models/userModel.js";
import bcrypt from "bcryptjs";

// Register user
export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if user already exists
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Set cookie
    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Something went wrong in server:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Something went wrong in server:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Logout user
export const logoutUser = async (_, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    message: "User logged out successfully",
  });
};
