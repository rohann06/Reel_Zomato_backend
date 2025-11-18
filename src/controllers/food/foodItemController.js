import { foodModel } from "../../models/foodModel.js";
import { foodPartnerModel } from "../../models/foodPartnerMoadel.js";

export const getFoodItem = async (req, res) => {
  try {
    const { foodId } = req.query;

    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required." });
    }

    const foodItem = await foodModel.findById(foodId);
    const foodPartnerDetails = await foodPartnerModel.findById(
      req.foodPartner._id
    );
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found." });
    }

    res.status(200).json({
      message: "Food item fetched successfully.",
      foodItem: {
        _id: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        description: foodItem.description,
        video: foodItem.video,
        foodPartnerDetails: {
          _id: foodPartnerDetails._id,
          restaurantName: foodPartnerDetails.restaurantName,
          restaurantAddress: foodPartnerDetails.restaurantAddress,
          phone: foodPartnerDetails.phone,
        },
      },
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong on the server side." });
  }
};

export const getuserFoodItem = async (req, res) => {
  try {
    const { foodId } = req.query;

    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required." });
    }

    const foodItem = await foodModel.findById(foodId);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found." });
    }

    res.status(200).json({
      message: "Food item fetched successfully.",
      foodItem: {
        _id: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        description: foodItem.description,
        video: foodItem.video,
      },
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong on the server side." });
  }
};
