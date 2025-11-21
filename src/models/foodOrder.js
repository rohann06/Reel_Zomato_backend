// foodOrder.model.js
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
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
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
