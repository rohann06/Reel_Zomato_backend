import { uploadFile } from "../../services/storageService.js";
import { v4 as uuidv4 } from "uuid";
import { foodModel } from "../../models/foodModel.js";

// Create food items
export const createFood = async (req, res) => {
  const { name, description, price } = req.body;

  // Validate required fields
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required." });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Video file is required." });
  }

  try {
    const uploadResult = await uploadFile(req.file.buffer, uuidv4());

    const foodItem = await foodModel.create({
      name,
      price,
      description,
      video: uploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
      message: "Food item created successfully.",
      foodItem: {
        _id: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        description: foodItem.description,
        video: foodItem.video,
        foodPartner: foodItem.foodPartner,
      },
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong on the server side." });
  }
};

// Get all food items for the logged-in food partner
export const getFood = async (req, res) => {
  try {
    const foodItems = await foodModel.find({
      foodPartner: req.foodPartner._id,
    });

    res.status(200).json({
      message: "Food items fetched successfully.",
      foodItems: foodItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        description: item.description,
        video: item.video,
        foodPartner: item.foodPartner,
      })),
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong on the server side." });
  }
};
