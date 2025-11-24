import mongoose from "mongoose";
const foodOrderSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userAddress: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    foodQuantity: {
      type: Number,
      required: true,
    },
    // Remove foodId string field
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
    foodItemPrice: {
      type: Number, // Changed to Number
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodPartner",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const foodOrderModel = mongoose.model("foodOrder", foodOrderSchema);
