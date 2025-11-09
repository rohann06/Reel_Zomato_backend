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

  // Validate required fields
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
    //checking for the same email
    const emailEexists = await foodPartnerModel.findOne({ email });
    if (emailEexists)
      return res.status(400).json({ message: "user already exist" });

    //Chacking for the 10dig in mobile number
    if (!/^\d{10}$/.test(String(phone))) {
      return res
        .status(400)
        .json({ message: "Please enter a valid 10-digit phone number" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const foodPartenr = await foodPartnerModel.create({
      ownerName,
      email,
      password: hasedPassword,
      phone,
      restaurantAddress,
      restaurantName,
    });

    const token = jwt.sign(
      {
        id: foodPartenr._id,
      },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // only true if using https (like render.com)
      sameSite: "none", // 👈 required for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Food partner creatd successfully",
      foodPartenr: {
        _id: foodPartenr._id,
        ownerName: foodPartenr.ownerName,
        email: foodPartenr.email,
        phone: foodPartenr.phone,
        restaurantAddress: foodPartenr.restaurantAddress,
        restaurantName: foodPartenr.restaurantName,
      },
    });
  } catch (error) {
    console.log("Something went wrong in server", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login food partner
export const loginFoodpartner = async (req, res) => {
  const { email, password } = req.body;

  // Chack the email
  const foodPartner = await foodPartnerModel.findOne({ email });
  if (!foodPartner)
    return res
      .status(400)
      .json({ message: "user not found, pease enter a valif email" });

  //Chacking password
  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.JWT_SECRET
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // only true if using https (like render.com)
    sameSite: "none", // 👈 required for cross-site cookies
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
};

// Logout food partner
export const logoutFoodPartner = async (_, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User looged out successfully." });
};
