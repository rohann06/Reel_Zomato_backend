import { foodModel } from "../../models/foodModel.js";

export const getFoodItem = async (req, res) => {
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
