import { foodModel } from "../../models/foodModel.js";
import { foodOrderModel } from "../../models/foodOrder.js";
import { foodPartnerModel } from "../../models/foodPartnerMoadel.js";
import { userModel } from "../../models/userModel.js";

export const orderFood = async (req, res) => {
  try {
    const {
      foodId,
      foodQuantity,
      userName,
      userAddress,
      userPhone,
      foodItemPrice,
    } = req.body;
    const userId = req.user._id;

    // Log the incoming data for debugging
    console.log("Order data received:", {
      foodId,
      foodQuantity,
      userName,
      userAddress,
      userPhone,
      foodItemPrice,
      userId,
    });

    // Validate all fields
    if (
      !foodId ||
      !foodQuantity ||
      !userName ||
      !userAddress ||
      !userPhone ||
      !foodItemPrice
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the food item
    const food = await foodModel.findById(foodId);
    if (!food) {
      console.log("Food item not found:", foodId);
      return res.status(404).json({ message: "Food item not found" });
    }

    console.log("Food found:", food);

    // Verify food partner exists
    if (!food.foodPartner) {
      console.log("No food partner associated with this food item");
      return res
        .status(400)
        .json({ message: "Food partner not found for this item" });
    }

    // Create new order
    const newOrder = new foodOrderModel({
      user: userId,
      foodItem: foodId,
      foodPartner: food.foodPartner,
      foodQuantity: Number(foodQuantity),
      foodItemPrice: parseFloat(foodItemPrice), // Convert to number
      userName: userName.trim(),
      userAddress: userAddress.trim(),
      userPhone: userPhone.trim(),
      foodId: foodId, // Add this if your schema still has foodId field
    });

    console.log("Creating order:", newOrder);

    // Save the order
    const savedOrder = await newOrder.save();
    console.log("Order saved successfully:", savedOrder._id);

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
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);

    // Send more detailed error for debugging
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await foodOrderModel
      .find({ user: userId })
      .populate("foodItem")
      .populate("foodPartner", "restaurantName restaurantAddress")
      .sort({ createdAt: -1 }); // Most recent first

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
      .populate("user", "fullName email")
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching partner orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Keeping the typo export as an alias
export const fodPaernerOrders = foodPartnerOrders;
