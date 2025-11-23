import { foodModel } from "../../models/foodModel.js";
import { foodOrderModel } from "../../models/foodOrder.js";
import { foodPartnerModel } from "../../models/foodPartnerMoadel.js";
import { userModel } from "../../models/userModel.js";

export const orderFood = async (req, res) => {
  try {
    const {
      foodId,
      quantity,
      userName,
      userAddress,
      userPhone,
      foodItemPrice,
    } = req.body;
    const userId = req.user._id;

    if (
      !foodId ||
      !quantity ||
      !userName ||
      !userAddress ||
      !userPhone ||
      foodItemPrice
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const newOrder = new foodOrderModel({
      user: userId,
      foodItem: foodId,
      foodPartner: food.foodPartner,
      foodQuantity: quantity,
      foodItemPrice: foodItemPrice,
      userName,
      userAddress,
      userPhone,
    });

    const savedOrder = await newOrder.save();

    // Update user's orders
    await userModel.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id },
    });

    // Update food partner's orders
    await foodPartnerModel.findByIdAndUpdate(food.foodPartner, {
      $push: { orders: savedOrder._id },
    });

    res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await foodOrderModel
      .find({ user: userId })
      .populate("foodItem")
      .populate("foodPartner", "restaurantName restaurantAddress");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const foodPartnerOrders = async (req, res) => {
  try {
    const partnerId = req.foodPartner._id;

    const orders = await foodOrderModel
      .find({ foodPartner: partnerId })
      .populate("foodItem")
      .populate("user", "fullName email");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching partner orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Keeping the typo export as an alias just in case, but the main logic is in foodPartnerOrders
export const fodPaernerOrders = foodPartnerOrders;
