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

    console.log("Fetching orders for user:", userId);

    const orders = await foodOrderModel
      .find({ user: userId })
      .populate("foodItem") // Populate food item details
      .populate("foodPartner", "restaurantName restaurantAddress") // Populate restaurant details
      .sort({ createdAt: -1 }) // Most recent first
      .lean(); // Convert to plain JavaScript objects for better performance

    console.log(`Found ${orders.length} orders for user`);

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const foodPartnerOrders = async (req, res) => {
  try {
    const partnerId = req.foodPartner._id;

    console.log("Fetching orders for food partner:", partnerId);

    const orders = await foodOrderModel
      .find({ foodPartner: partnerId }) // Only this partner's orders
      .populate("foodItem") // Get food details
      .populate("user", "fullName email phone") // Get customer details
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    console.log(`Found ${orders.length} orders for partner`);

    // Optional: Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.foodQuantity * order.foodItemPrice;
    }, 0);

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
      totalRevenue: totalRevenue.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching partner orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 🆕 NEW FUNCTION - Add this to complete orders
export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.foodPartner._id;

    console.log("Completing order:", orderId, "for partner:", partnerId);

    // Find the order and verify it belongs to this food partner
    const order = await foodOrderModel.findOne({
      _id: orderId,
      foodPartner: partnerId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // Check if already completed
    if (order.orderStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Order is already completed",
      });
    }

    // Update order status to completed
    order.orderStatus = "completed";
    await order.save();

    console.log("Order completed successfully:", orderId);

    res.status(200).json({
      success: true,
      message: "Order marked as completed",
      order,
    });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
